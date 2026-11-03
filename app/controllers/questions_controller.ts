import { createHash, timingSafeEqual } from 'node:crypto'
import Question from '#models/question'
import QuestionTransformer from '#transformers/question_transformer'
import { createQuestionValidator } from '#validators/question'
import { quizSubmissionValidator } from '#validators/quiz_submission'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

type StoredQuizResult = {
  correct: number
  total: number
  answers: { questionId: number; optionId: number }[]
}

function uniqueChoices(options: { text: string }[]) {
  return new Set(options.map(({ text }) => text.trim().toLocaleLowerCase())).size === 4
}

function isAdmin(session: HttpContext['session']) {
  return session.get('adminAuthorized') === true
}

export default class QuestionsController {
  // Public: never serialize the isCorrect flag to quiz participants.
  async index({ inertia }: HttpContext) {
    const questions = await Question.query()
      .preload('options', (query) => query.orderBy('position'))
      .orderBy('id')

    return inertia.render('quiz', {
      questions: QuestionTransformer.transform(questions),
    })
  }

  async login({ session, response, inertia }: HttpContext) {
    if (isAdmin(session)) return response.redirect().toRoute('configuration')
    return inertia.render('admin_login', {})
  }

  async authenticate({ request, session, response }: HttpContext) {
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
    return response.redirect().toRoute('configuration')
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

  // Existing server-side submission checks retained.
  async submit({ request, response, session }: HttpContext) {
    const { answers } = await request.validateUsing(quizSubmissionValidator)
    const allQuestions = await Question.query().preload('options')
    const questions = allQuestions.filter(
      (question) =>
        question.options.length === 4 &&
        question.options.filter((option) => option.isCorrect).length === 1
    )
    const submitted = new Map<number, number>()
    for (const answer of answers) submitted.set(answer.questionId, answer.optionId)

    const validSubmission =
      questions.length > 0 &&
      answers.length === questions.length &&
      submitted.size === questions.length &&
      questions.every(
        (question) =>
          submitted.has(question.id) &&
          question.options.some((option) => option.id === submitted.get(question.id))
      )

    if (!validSubmission) {
      session.flash('error', 'Please answer every question with a valid choice.')
      return response.redirect().toRoute('quiz')
    }

    const correct = questions.filter((question) =>
      question.options.some(
        (option) => option.isCorrect && option.id === submitted.get(question.id)
      )
    ).length

    const result: StoredQuizResult = { correct, total: questions.length, answers }
    session.put('quizResult', result)
    return response.redirect().toRoute('quiz.results')
  }

  async results({ session, response, inertia }: HttpContext) {
    const saved = session.get('quizResult') as StoredQuizResult | undefined
    if (!saved || saved.total === 0) return response.redirect().toRoute('quiz')

    const questions = await Question.query().preload('options')
    const details = saved.answers.map((answer) => {
      const question = questions.find((item) => item.id === answer.questionId)
      const selected = question?.options.find((option) => option.id === answer.optionId)
      const correctOption = question?.options.find((option) => option.isCorrect)
      return {
        question: question?.text ?? 'Question unavailable',
        selectedAnswer: selected?.text ?? 'Unavailable',
        correctAnswer: correctOption?.text ?? 'Unavailable',
        isCorrect: Boolean(selected?.isCorrect),
      }
    })

    return inertia.render('results', {
      result: {
        correct: saved.correct,
        total: saved.total,
        percentage: Math.round((saved.correct / saved.total) * 100),
        details,
      },
    })
  }
}
