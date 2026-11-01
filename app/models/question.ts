import { QuestionSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import QuestionOption from './question_option.js'

export default class Question extends QuestionSchema {
  @hasMany(() => QuestionOption)
  declare options: HasMany<typeof QuestionOption>
}
