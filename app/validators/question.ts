import vine from '@vinejs/vine'

export const createQuestionValidator = vine.create({
  text: vine.string().trim().minLength(1).maxLength(500),

  options: vine
    .array(
      vine.object({
        text: vine.string().trim().minLength(1).maxLength(250),
      })
    )
    .fixedLength(4),

  correctIndex: vine.number().withoutDecimals().min(0).max(3),
})
