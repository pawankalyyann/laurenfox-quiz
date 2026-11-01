import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'question_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('question_id')
        .unsigned()
        .notNullable()
        .references('questions.id')
        .onDelete('CASCADE')

      table.text('text').notNullable()

      table.boolean('is_correct').notNullable().defaultTo(false)

      table.integer('position').notNullable().defaultTo(0)

      table.index(['question_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
