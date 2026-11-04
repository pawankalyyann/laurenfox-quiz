import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { readFile } from 'node:fs/promises'

export default class SeedQuiz extends BaseCommand {
  static commandName = 'quiz:seed'
  static description = 'Load exported quiz questions into an empty database'
  static options: CommandOptions = { startApp: true }

  async run() {
    const { default: Question } = await import('#models/question')
    const { default: db } = await import('@adonisjs/lucid/services/db')
    const { createQuestionValidator } = await import('#validators/question')
    if (await Question.first()) {
      this.logger.info('Questions already exist; no data changed.')
      return
    }
    const source: unknown = JSON.parse(
      await readFile(this.app.makePath('database/fixtures/questions.json'), 'utf8')
    )
    if (!Array.isArray(source) || source.length === 0 || source.length > 100)
      throw new Error('Expected 1–100 exported questions')
    const questions = await Promise.all(
      source.map((item) => createQuestionValidator.validate(item))
    )
    await db.transaction(async (trx) => {
      for (const item of questions) {
        const question = new Question()
        question.useTransaction(trx)
        question.text = item.text
        await question.save()
        await question.related('options').createMany(
          item.options.map((option, position) => ({
            text: option.text,
            position,
            isCorrect: position === item.correctIndex,
          }))
        )
      }
    })
    this.logger.success(`Imported ${questions.length} questions.`)
  }
}
