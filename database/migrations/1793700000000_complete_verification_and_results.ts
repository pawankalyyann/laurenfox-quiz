import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // Additive repair: the previously applied OTP migration only created timestamps.
    this.schema.alterTable('otp_challenges', (table) => {
      table
        .integer('participant_id')
        .unsigned()
        .references('id')
        .inTable('participants')
        .onDelete('CASCADE')
        .nullable()
        .index()
      table.string('code_hash', 64).nullable()
      table.timestamp('expires_at').nullable()
      table.timestamp('last_sent_at').nullable()
      table.integer('failed_attempts').notNullable().defaultTo(0)
      table.timestamp('used_at').nullable()
    })
    this.schema.createTable('quiz_attempts', (table) => {
      table.increments('id')
      table
        .integer('participant_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('participants')
        .onDelete('CASCADE')
        .index()
      table.string('token', 36).notNullable().unique()
      table.integer('correct').notNullable()
      table.integer('total').notNullable()
      table.text('details').notNullable()
      table.timestamp('created_at').notNullable()
    })
    this.schema.createTable('request_limits', (table) => {
      table.string('key', 128).primary()
      table.integer('count').notNullable().defaultTo(0)
      table.bigInteger('expires_at').notNullable().index()
    })
  }
  async down() {
    this.schema.dropTable('request_limits')
    this.schema.dropTable('quiz_attempts')
    this.schema.alterTable('otp_challenges', (table) => {
      table.dropColumns(
        'participant_id',
        'code_hash',
        'expires_at',
        'last_sent_at',
        'failed_attempts',
        'used_at'
      )
    })
  }
}
