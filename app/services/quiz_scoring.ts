import { createHash } from 'node:crypto'

type Question = {
  id: number
  text: string
  options: { id: number; text: string; position: number; isCorrect: boolean }[]
}
export function readyQuestions<T extends Question>(questions: T[]): T[] {
  return questions.filter(
    (q) => q.options.length === 4 && q.options.filter((o) => o.isCorrect).length === 1
  )
}
export function quizFingerprint(questions: Question[]) {
  const data = [...questions]
    .sort((a, b) => a.id - b.id)
    .map((q) => ({
      id: q.id,
      text: q.text,
      options: [...q.options]
        .sort((a, b) => a.id - b.id)
        .map((o) => ({
          id: o.id,
          text: o.text,
          position: o.position,
          isCorrect: Boolean(o.isCorrect),
        })),
    }))
  return createHash('sha256').update(JSON.stringify(data)).digest('hex')
}
export function gradeQuiz(
  questions: Question[],
  answers: { questionId: number; optionId: number }[]
) {
  const selected = new Map(answers.map((a) => [a.questionId, a.optionId]))
  if (
    !questions.length ||
    answers.length !== questions.length ||
    selected.size !== questions.length
  )
    return null
  if (!questions.every((q) => q.options.some((o) => o.id === selected.get(q.id)))) return null
  const details = questions.map((q) => {
    const choice = q.options.find((o) => o.id === selected.get(q.id))!
    return {
      question: q.text,
      selectedAnswer: choice.text,
      correctAnswer: q.options.find((o) => o.isCorrect)!.text,
      isCorrect: Boolean(choice.isCorrect),
    }
  })
  return { correct: details.filter((d) => d.isCorrect).length, total: questions.length, details }
}
