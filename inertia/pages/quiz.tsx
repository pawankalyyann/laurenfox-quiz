import { useState } from 'react'
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

  const configuredQuestions = questions.filter((question) => (question.options?.length ?? 0) > 0)

  const answeredCount = configuredQuestions.filter(
    (question) => answers[question.id] !== undefined
  ).length

  function selectAnswer(questionId: number, optionId: number) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }))
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
        </div>

        {questions.length === 0 && <p>No questions are available yet.</p>}

        {questions.map((question) => (
          <QuestionView
            key={question.id}
            question={question}
            selectedOptionId={answers[question.id]}
            onSelect={(optionId) => selectAnswer(question.id, optionId)}
          />
        ))}
      </div>
    </Page>
  )
}

Quiz.layout = [AppLayout]
