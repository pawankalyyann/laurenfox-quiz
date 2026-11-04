/* eslint-disable @unicorn/no-await-expression-member -- Keep HTTP response assertions adjacent to the request under test. */
import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import db from '@adonisjs/lucid/services/db'
import Question from '#models/question'
import env from '#start/env'
import { DateTime } from 'luxon'

type QuizPage = {
  component: string
  props: { attemptToken: string; questions: { id: number; options: { id: number }[] }[] }
}
type ResultPage = { props: { result: { correct: number; details: { question: string }[] } } }
type DashboardPage = { component: string; props: { stats: { attempts: number } } }

function browser() {
  const cookies = new Map<string, string>()
  return async (path: string, body?: object, method = body ? 'POST' : 'GET') => {
    const headers: Record<string, string> = {
      'X-Inertia': 'true',
      'Accept': 'text/html, application/xhtml+xml',
      'Cookie': [...cookies].map(([k, v]) => `${k}=${v}`).join('; '),
    }
    if (body) {
      headers['Content-Type'] = 'application/json'
      headers['X-XSRF-TOKEN'] = decodeURIComponent(cookies.get('XSRF-TOKEN') || '')
    }
    const response = await fetch(`http://${env.get('HOST')}:${env.get('PORT')}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
    })
    for (const cookie of response.headers.getSetCookie()) {
      const entry = cookie.split(';')[0]
      const at = entry.indexOf('=')
      cookies.set(entry.slice(0, at), entry.slice(at + 1))
    }
    return response
  }
}

test('HTTP: verification, access controls, scoring, persistence and admin isolation', async ({
  assert,
}) => {
  const fake = mail.fake()
  try {
    const question = await Question.create({ text: 'Integration test question' })
    await question
      .related('options')
      .createMany(
        [0, 1, 2, 3].map((i) => ({ text: `Option ${i}`, position: i, isCorrect: i === 0 }))
      )
    const visit = browser()
    assert.equal((await visit('/')).headers.get('location'), '/welcome')
    assert.equal((await visit('/admin/dashboard')).headers.get('location'), '/admin/login')
    await visit('/register')
    assert.equal(
      (
        await visit('/register', {
          fullName: 'Test Participant',
          email: 'flow@example.com',
          phone: '',
        })
      ).headers.get('location'),
      '/verify-email'
    )
    fake.messages.assertSentCount(1)
    const code = String(fake.messages.sent()[0].nodeMailerMessage.text).match(/\b\d{6}\b/)![0]
    assert.equal((await visit('/')).headers.get('location'), '/welcome')
    assert.equal(
      (await visit('/verify-email', { code: 'wrong' })).headers.get('location'),
      '/verify-email'
    )
    assert.equal((await visit('/verify-email', { code })).headers.get('location'), '/')
    const quiz = (await (await visit('/')).json()) as QuizPage
    assert.equal(quiz.component, 'quiz')
    assert.notProperty(quiz.props.questions[0].options[0], 'isCorrect')
    const answers = quiz.props.questions.map((q: { id: number; options: { id: number }[] }) => ({
      questionId: q.id,
      optionId: q.options[0].id,
    }))
    assert.equal(
      (await visit('/quiz/submit', { answers, attemptToken: quiz.props.attemptToken })).headers.get(
        'location'
      ),
      '/quiz/results'
    )
    const result = (await (await visit('/quiz/results')).json()) as ResultPage
    assert.equal(result.props.result.correct, 1)
    await visit('/quiz/submit', { answers, attemptToken: quiz.props.attemptToken })
    assert.equal(Number((await db.from('quiz_attempts').count('* as n').first()).n), 1)
    question.text = 'Changed after submission'
    await question.save()
    const historical = (await (await visit('/quiz/results')).json()) as ResultPage
    assert.equal(historical.props.result.details[0].question, 'Integration test question')
    const stranger = browser()
    assert.equal((await stranger('/quiz/results')).headers.get('location'), '/register')
    await stranger('/register')
    // Knowing an already verified email never grants access in a new browser.
    await stranger('/register', { fullName: 'Impostor', email: 'flow@example.com', phone: '' })
    assert.equal((await stranger('/')).headers.get('location'), '/welcome')
    assert.equal(
      (await visit('/questions', { text: 'Unauthorized' }, 'POST')).headers.get('location'),
      '/admin/login'
    )
    await visit('/admin/login')
    await visit('/admin/login', { password: env.get('ADMIN_ACCESS_KEY') })
    const dashboard = (await (await visit('/admin/dashboard')).json()) as DashboardPage
    assert.equal(dashboard.component, 'admin_dashboard')
    assert.equal(dashboard.props.stats.attempts, 1)
  } finally {
    mail.restore()
  }
})

test('HTTP: expiry, five-attempt lockout, resend cooldown and CSRF protection', async ({
  assert,
}) => {
  const fake = mail.fake()
  try {
    const visit = browser()
    await visit('/register')
    await visit('/register', { fullName: 'Retry Tester', email: 'retry@example.com', phone: '' })
    const code = String(fake.messages.sent()[0].nodeMailerMessage.text).match(/\b\d{6}\b/)![0]
    await visit('/verify-email/resend', {})
    fake.messages.assertSentCount(1)
    const wrong = code === '000000' ? '111111' : '000000'
    for (let i = 0; i < 5; i++) await visit('/verify-email', { code: wrong })
    assert.equal((await visit('/verify-email', { code })).headers.get('location'), '/verify-email')
    const person = await db.from('participants').where('email', 'retry@example.com').firstOrFail()
    const challenge = await db
      .from('otp_challenges')
      .where('participant_id', person.id)
      .firstOrFail()
    assert.equal(challenge.failed_attempts, 5)
    assert.isFalse(Boolean(person.email_verified))
    const expiredVisit = browser()
    await expiredVisit('/register')
    await expiredVisit('/register', {
      fullName: 'Expiry Tester',
      email: 'expiry@example.com',
      phone: '',
    })
    const expiredCode = String(fake.messages.sent()[1].nodeMailerMessage.text).match(
      /\b\d{6}\b/
    )![0]
    const expiredPerson = await db
      .from('participants')
      .where('email', 'expiry@example.com')
      .firstOrFail()
    await db
      .from('otp_challenges')
      .where('participant_id', expiredPerson.id)
      .update({ expires_at: DateTime.utc().minus({ minutes: 1 }).toSQL() })
    assert.equal(
      (await expiredVisit('/verify-email', { code: expiredCode })).headers.get('location'),
      '/verify-email'
    )
    const csrf = await fetch(`http://${env.get('HOST')}:${env.get('PORT')}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ fullName: 'Bad', email: 'bad@example.com' }),
      redirect: 'manual',
    })
    assert.equal(csrf.status, 302)
    assert.isNull(await db.from('participants').where('email', 'bad@example.com').first())
  } finally {
    mail.restore()
  }
})

test('HTTP: admin question CRUD, stale quizzes, and revoked admin access', async ({ assert }) => {
  await db.from('request_limits').delete()
  const fake = mail.fake()
  try {
    const admin = browser()
    await admin('/admin/login')
    await admin('/admin/login', { password: env.get('ADMIN_ACCESS_KEY') })
    const payload = {
      text: 'Admin CRUD fixture',
      options: [0, 1, 2, 3].map((i) => ({ text: `Answer ${i}` })),
      correctIndex: 2,
    }
    assert.equal((await admin('/questions', payload)).headers.get('location'), '/configuration')
    const q = await db.from('questions').where('text', payload.text).firstOrFail()
    assert.equal(
      Number(
        (
          await db
            .from('question_options')
            .where('question_id', q.id)
            .where('is_correct', true)
            .count('* as n')
            .first()
        ).n
      ),
      1
    )
    const visit = browser()
    await visit('/register')
    await visit('/register', { fullName: 'Stale Tester', email: 'stale@example.com', phone: '' })
    const code = String(fake.messages.sent()[0].nodeMailerMessage.text).match(/\b\d{6}\b/)![0]
    await visit('/verify-email', { code })
    const quiz = (await (await visit('/')).json()) as QuizPage
    await admin(`/questions/${q.id}`, { ...payload, text: 'Admin edited question' }, 'PUT')
    const before = Number((await db.from('quiz_attempts').count('* as n').first()).n)
    const answers = quiz.props.questions.map((item) => ({
      questionId: item.id,
      optionId: item.options[0].id,
    }))
    assert.equal(
      (await visit('/quiz/submit', { answers, attemptToken: quiz.props.attemptToken })).headers.get(
        'location'
      ),
      '/'
    )
    assert.equal(Number((await db.from('quiz_attempts').count('* as n').first()).n), before)
    await admin(`/questions/${q.id}`, {}, 'DELETE')
    assert.isNull(await db.from('questions').where('id', q.id).first())
    await admin('/admin/logout', {})
    assert.equal((await admin('/configuration')).headers.get('location'), '/admin/login')
  } finally {
    mail.restore()
  }
})
