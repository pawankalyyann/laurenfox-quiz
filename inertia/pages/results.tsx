import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { type InertiaProps } from '~/types'

type QuizResult = {
  correct: number
  total: number
  percentage: number
  details: {
    question: string
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }[]
}

type Props = InertiaProps<{ result: QuizResult }>

export default function Results({ result }: Props) {
  return (
    <Page title="Quiz Results">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Assessment complete
          </p>
          <h1 className="mt-3 text-3xl font-bold">Your Results</h1>
          <p className="mt-5 text-6xl font-extrabold text-blue-700">{result.percentage}%</p>
          <p className="mt-3 text-lg text-gray-600">
            {result.correct} correct out of {result.total} questions
          </p>
          <a
            href="/"
            className="mt-7 inline-flex rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Retake Assessment
          </a>
        </section>

        <section className="space-y-4" aria-label="Answer review">
          <h2 className="text-xl font-bold">Answer Review</h2>
          {result.details.map((detail, index) => (
            <article key={index} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">
                  {index + 1}. {detail.question}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    detail.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {detail.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                <strong>Your answer:</strong> {detail.selectedAnswer}
              </p>
              {!detail.isCorrect && (
                <p className="mt-1 text-sm text-green-800">
                  <strong>Correct answer:</strong> {detail.correctAnswer}
                </p>
              )}
            </article>
          ))}
        </section>
      </div>
    </Page>
  )
}

Results.layout = [AppLayout]
