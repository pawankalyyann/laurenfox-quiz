import vine from '@vinejs/vine'

export const registerParticipantValidator = vine.create({
  fullName: vine.string().trim().minLength(2).maxLength(120),
  email: vine.string().trim().email().maxLength(254),
  phone: vine.string().trim().maxLength(32).optional(),
})
