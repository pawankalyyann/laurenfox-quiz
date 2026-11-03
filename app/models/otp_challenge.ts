import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class OtpChallenge extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare participantId: number

  @column()
  declare codeHash: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime()
  declare lastSentAt: DateTime

  @column()
  declare failedAttempts: number

  @column.dateTime()
  declare usedAt: DateTime | null
}
