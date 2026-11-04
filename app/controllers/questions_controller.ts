import { createHash, timingSafeEqual, randomUUID } from 'node:crypto'
import Question from '#models/question'
import { DateTime } from 'luxon'
import { verifiedParticipant } from '#services/participant_access'
import { allowRequest } from '#services/request_limit'
import { readyQuestions, quizFingerprint, gradeQuiz } from '#services/quiz_scoring'
import QuestionTransformer from '#transformers/question_transformer'
import { createQuestionValidator } from '#validators/question'
import { quizSubmissionValidator } from '#validators/quiz_submission'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

function uniqueChoices(options: { text: string }[]) {
  return new Set(options.map(({ text }) => text.trim().toLocaleLowerCase())).size === 4
}

function isAdmin(session: HttpContext['session']) {
  return session.get('adminAuthorized') === true
}

export default class QuestionsController {
  // Public: never serialize the isCorrect flag to quiz participants.
  async index({ inertia, session, response }: HttpContext) {
    if (!(await verifiedParticipant(session))) return response.redirect().toPath('/welcome')
    const questions = await Question.query()
      .preload('options', (query) => query.orderBy('position'))
      .orderBy('id')

    const fingerprint = quizFingerprint(readyQuestions(questions))
    const previous = session.get('quizAttempt')
    if (!previous || previous.fingerprint !== fingerprint) {
      session.put('quizAttempt', { token: randomUUID(), fingerprint })
    }
    return inertia.render('quiz', {
      questions: QuestionTransformer.transform(readyQuestions(questions)),
      attemptToken: session.get('quizAttempt').token,
    })
  }

  async login({ session, response, inertia }: HttpContext) {
    if (isAdmin(session)) return response.redirect().toPath('/admin/dashboard')
    return inertia.render('admin_login', {})
  }

  async authenticate({ request, session, response }: HttpContext) {
    if (!(await allowRequest('admin-login', request.ip(), 10, 900))) {
      session.flash('error', 'Too many login attempts. Try again in 15 minutes.')
      return response.redirect().toRoute('admin.login')
    }
    const configuredKey = env.get('ADMIN_ACCESS_KEY')
    const password = request.input('password')

    if (!configuredKey) {
      session.flash('error', 'Admin access is not configured. See ADMIN_SETUP.md.')
      return response.redirect().toRoute('admin.login')
    }

    if (typeof password !== 'string' || password.length === 0 || password.length > 512) {
      session.flash('error', 'Invalid credentials.')
      return response.redirect().toRoute('admin.login')
    }

    // Hash both values to equal-length buffers before constant-time comparison.
    const supplied = createHash('sha256').update(password).digest()
    const expected = createHash('sha256').update(configuredKey).digest()
    if (!timingSafeEqual(supplied, expected)) {
      session.flash('error', 'Invalid credentials.')
      return response.redirect().toRoute('admin.login')
    }

    await session.regenerate()
    session.put('adminAuthorized', true)
    return response.redirect().toPath('/admin/dashboard')
  }

  async logout({ session, response }: HttpContext) {
    session.forget('adminAuthorized')
    await session.regenerate()
    return response.redirect().toRoute('quiz')
  }

  // Admin: questions and correct index are only sent to an authorized session.
  async create({ inertia, session, response }: HttpContext) {
    if (!isAdmin(session)) return response.redirect().toRoute('admin.login')

    const questions = await Question.query()
      .preload('options', (query) => query.orderBy('position'))
      .orderBy('id')

    return inertia.render('configuration', {
      questions: questions.map((question) => ({
        id: question.id,
        text: question.text,
        correctIndex: question.options.findIndex((option) => option.isCorrect),
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          position: option.position,
        })),
      })),
    })
  }

  async store({ request, response, session }: HttpContext) {
    if (!isAdmin(session)) return response.redirect().toRoute('admin.login')
    const { text, options, correctIndex } = await request.validateUsing(createQuestionValidator)

    if (!uniqueChoices(options)) {
      session.flash('error', 'All four answer choices must be different.')
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      const question = new Question()
      question.useTransaction(trx)
      question.text = text
      await question.save()

      await question.related('options').createMany(
        options.map((option, index) => ({
          text: option.text,
          isCorrect: index === correctIndex,
          position: index,
        }))
      )
    })

    session.flash('success', 'Question created.')
    return response.redirect().toRoute('configuration')
  }

  // Admin: update question and options without losing option IDs when possible.
  async update({ params, request, response, session }: HttpContext) {
    if (!isAdmin(session)) return response.redirect().toRoute('admin.login')
    const { text, options, correctIndex } = await request.validateUsing(createQuestionValidator)

    if (!uniqueChoices(options)) {
      session.flash('error', 'All four answer choices must be different.')
      return response.redirect().back()
    }

    const question = await Question.query()
      .where('id', params.id)
      .preload('options', (query) => query.orderBy('position'))
      .firstOrFail()

    await db.transaction(async (trx) => {
      question.useTransaction(trx)
      question.text = text
      await question.save()

      if (question.options.length === 4) {
        for (const [index, option] of question.options.entries()) {
          option.useTransaction(trx)
          option.text = options[index].text
          option.isCorrect = index === correctIndex
          option.position = index
          await option.save()
        }
      } else {
        await trx.from('question_options').where('question_id', question.id).delete()
        await question.related('options').createMany(
          options.map((option, index) => ({
            text: option.text,
            isCorrect: index === correctIndex,
            position: index,
          }))
        )
      }
    })

    session.flash('success', 'Question updated.')
    return response.redirect().toRoute('configuration')
  }

  async destroy({ params, response, session }: HttpContext) {
    if (!isAdmin(session)) return response.redirect().toRoute('admin.login')
    const question = await Question.findOrFail(params.id)
    await question.delete()
    session.flash('success', 'Question deleted.')
    return response.redirect().toRoute('configuration')
  }

  async submit({ request, response, session }: HttpContext) {
    const participant = await verifiedParticipant(session)
    if (!participant) return response.redirect().toPath('/register')
    const { answers } = await request.validateUsing(quizSubmissionValidator)
    const attempt = session.get('quizAttempt')
    if (!attempt || request.input('attemptToken') !== attempt.token) {
      session.flash('error', 'This quiz session has ended. Please start a new attempt.')
      return response.redirect().toRoute('quiz')
    }
    const questions = readyQuestions(await Question.query().preload('options').orderBy('id'))
    if (quizFingerprint(questions) !== attempt.fingerprint) {
      session.forget('quizAttempt')
      session.flash(
        'error',
        'Questions changed while you were answering. Please review the updated quiz.'
      )
      return response.redirect().toRoute('quiz')
    }
    const result = gradeQuiz(questions, answers)
    if (!result) {
      session.flash('error', 'Please answer every question with a valid choice.')
      return response.redirect().toRoute('quiz')
    }
    // Unique token makes repeated submission idempotent. Store review text as a historical snapshot.
    await db
      .table('quiz_attempts')
      .insert({
        participant_id: participant.id,
        token: attempt.token,
        correct: result.correct,
        total: result.total,
        details: JSON.stringify(result.details),
        created_at: DateTime.utc().toSQL(),
      })
      .onConflict('token')
      .ignore()
    const saved = await db
      .from('quiz_attempts')
      .where('token', attempt.token)
      .where('participant_id', participant.id)
      .firstOrFail()
    session.put('quizResultId', saved.id)
    session.forget('quizAttempt')
    return response.redirect().toRoute('quiz.results')
  }

  async results({ session, response, inertia }: HttpContext) {
    const participant = await verifiedParticipant(session)
    if (!participant) return response.redirect().toPath('/register')
    const saved = await db
      .from('quiz_attempts')
      .where('id', session.get('quizResultId') || 0)
      .where('participant_id', participant.id)
      .first()
    if (!saved) return response.redirect().toRoute('quiz')
    return inertia.render('results', {
      result: {
        correct: saved.correct,
        total: saved.total,
        percentage: Math.round((saved.correct / saved.total) * 100),
        details: JSON.parse(saved.details),
      },
    })
  }
}
