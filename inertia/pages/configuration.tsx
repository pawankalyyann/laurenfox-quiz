import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { type InertiaProps } from '~/types'
import QuestionForm from '~/components/question_form'
import QuestionConfig, { type AdminQuestion } from '~/components/question_config'

type Props = InertiaProps<{ questions: AdminQuestion[] }>

export default function Configuration({ questions }: Props) {
  return (
    <Page
      title="Question Management"
      description="Private administrator workspace: add, edit, and delete multiple-choice questions."
    >
      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-stone-900">Add a question</h2>
          <QuestionForm />
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Saved questions ({questions.length})</h2>
          {questions.length === 0 && <p>No questions yet.</p>}
          {questions.map((question, index) => (
            <QuestionConfig key={question.id} question={question} number={index + 1} />
          ))}
        </section>
      </div>
    </Page>
  )
}
Configuration.layout = [AppLayout]
