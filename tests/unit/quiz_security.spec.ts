import { test } from '@japa/runner'
import { generateOtpCode, hashOtpCode, verifyOtpCode } from '#services/otp_code'
import { gradeQuiz, quizFingerprint, readyQuestions } from '#services/quiz_scoring'

const question = {
  id: 1,
  text: 'Question',
  options: [0, 1, 2, 3].map((i) => ({
    id: i + 10,
    text: `Choice ${i}`,
    position: i,
    isCorrect: i === 0,
  })),
}
test('OTP is six digits and bound to the participant and secret', ({ assert }) => {
  for (let i = 0; i < 100; i++) assert.match(generateOtpCode(), /^\d{6}$/)
  const hash = hashOtpCode('012345', 1, 'secret-one')
  assert.isTrue(verifyOtpCode('012345', hash, 1, 'secret-one'))
  assert.isFalse(verifyOtpCode('012345', hash, 2, 'secret-one'))
  assert.isFalse(verifyOtpCode('012345', hash, 1, 'secret-two'))
  assert.isFalse(verifyOtpCode('012346', hash, 1, 'secret-one'))
  assert.isFalse(verifyOtpCode('12345', hash, 1, 'secret-one'))
  assert.isFalse(verifyOtpCode('012345', 'malformed', 1, 'secret-one'))
})
test('scoring rejects missing, duplicate, unknown and foreign options', ({ assert }) => {
  assert.equal(gradeQuiz([question], [{ questionId: 1, optionId: 10 }])?.correct, 1)
  assert.equal(gradeQuiz([question], [{ questionId: 1, optionId: 11 }])?.correct, 0)
  for (const answers of [
    [],
    [{ questionId: 2, optionId: 10 }],
    [{ questionId: 1, optionId: 99 }],
    [
      { questionId: 1, optionId: 10 },
      { questionId: 1, optionId: 11 },
    ],
  ])
    assert.isNull(gradeQuiz([question], answers))
})
test('quiz fingerprints detect edits and exclude unconfigured questions', ({ assert }) => {
  assert.notEqual(quizFingerprint([question]), quizFingerprint([{ ...question, text: 'Edited' }]))
  assert.notEqual(
    quizFingerprint([question]),
    quizFingerprint([
      { ...question, options: question.options.map((o) => ({ ...o, isCorrect: o.id === 11 })) },
    ])
  )
  assert.equal(
    quizFingerprint([question]),
    quizFingerprint([{ ...question, options: [...question.options].reverse() }])
  )
  assert.lengthOf(readyQuestions([question, { ...question, id: 2, options: [] }]), 1)
})
