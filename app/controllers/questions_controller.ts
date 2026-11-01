import Question from '#models/question'
import type { HttpContext } from '@adonisjs/core/http'
import QuestionTransformer from '#transformers/question_transformer'
import { createQuestionValidator } from '#validators/question'
import db from '@adonisjs/lucid/services/db'

export default class QuestionsController {
  async index({ inertia }: HttpContext) {
    const questions = await Question.query()
      .preload('options', (query) => query.orderBy('position'))
      .orderBy('id')

    return inertia.render('quiz', {
      questions: QuestionTransformer.transform(questions),
    })
  }

  async create({ inertia }: HttpContext) {
    const questions = await Question.query()
      .preload('options', (query) => query.orderBy('position'))
      .orderBy('id')

    return inertia.render('configuration', {
      questions: QuestionTransformer.transform(questions),
    })
  }

  async store({ request, response }: HttpContext) {
    const { text, options, correctIndex } = await request.validateUsing(createQuestionValidator)

    await db.transaction(async (trx) => {
      const question = new Question()
      question.text = text
      question.useTransaction(trx)

      await question.save()

      await question.related('options').createMany(
        options.map((option, index) => ({
          text: option.text,
          isCorrect: index === correctIndex,
          position: index,
        }))
      )
    })

    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const question = await Question.findOrFail(params.id)
    await question.delete()

    return response.redirect().back()
  }
}
