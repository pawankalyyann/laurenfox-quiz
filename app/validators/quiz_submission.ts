import vine from '@vinejs/vine'

export const quizSubmissionValidator = vine.create({
  answers: vine
    .array(
      vine.object({
        questionId: vine.number().withoutDecimals().positive(),
        optionId: vine.number().withoutDecimals().positive(),
      })
    )
    .minLength(1)
    .maxLength(100),
})
