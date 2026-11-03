import { useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import QuestionView from '~/components/question_view'

type Props = InertiaProps<{
  questions: Data.Question[]
}>

export default function Quiz({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const configuredQuestions = questions.filter((question) => (question.options?.length ?? 0) === 4)
  const answeredCount = configuredQuestions.filter(
    (question) => answers[question.id] !== undefined
  ).length
  const canSubmit = configuredQuestions.length > 0 && answeredCount === configuredQuestions.length

  function selectAnswer(questionId: number, optionId: number) {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }))
  }

  return (
    <Page title="MIS Knowledge Assessment">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">MIS Knowledge Assessment</h2>
          <p className="mt-2 text-gray-600">Test your knowledge of business and technology.</p>
          <div className="mt-4 font-medium text-blue-700">
            {answeredCount} of {configuredQuestions.length} answered
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-label="Quiz completion"
            aria-valuemin={0}
            aria-valuemax={configuredQuestions.length}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${configuredQuestions.length > 0 ? (answeredCount / configuredQuestions.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {configuredQuestions.length === 0 && (
          <p className="rounded-xl border bg-white p-6">
            No multiple-choice questions are currently available.
          </p>
        )}

        <Form route="quiz.submit">
          {({ processing, errors }) => (
            <div className="space-y-5">
              {configuredQuestions.map((question, index) => (
                <div key={question.id}>
                  <input type="hidden" name={`answers[${index}][questionId]`} value={question.id} />
                  <input
                    type="hidden"
                    name={`answers[${index}][optionId]`}
                    value={answers[question.id] ?? ''}
                  />
                  <QuestionView
                    question={question}
                    number={index + 1}
                    selectedOptionId={answers[question.id]}
                    onSelect={(optionId) => selectAnswer(question.id, optionId)}
                  />
                </div>
              ))}

              {configuredQuestions.length > 0 && (
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <p className="mb-3 text-sm text-gray-600">
                    Select an answer for every question before submitting.
                  </p>
                  {errors.answers && (
                    <p className="mb-3 text-sm text-red-700" role="alert">
                      {errors.answers}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canSubmit || processing}
                  >
                    {processing ? 'Grading your quiz...' : 'Submit Quiz & View Results'}
                  </button>
                </div>
              )}
            </div>
          )}
        </Form>
      </div>
    </Page>
  )
}

Quiz.layout = [AppLayout]
