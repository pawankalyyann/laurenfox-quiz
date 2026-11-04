import { useState } from 'react'
import { Form } from '@adonisjs/inertia/react'

export type AdminQuestion = {
  id: number
  text: string
  correctIndex: number
  options: { id: number; text: string; position: number }[]
}

const letters = ['A', 'B', 'C', 'D']

export default function QuestionConfig({
  question,
  number,
}: {
  question: AdminQuestion
  number: number
}) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wide text-red-800">
            Question {String(number).padStart(2, '0')}
          </span>
          <h3 className="mt-1 font-semibold text-stone-900">{question.text}</h3>
          <p className="mt-1 text-xs text-stone-500">
            4 answer choices ·{' '}
            {question.correctIndex >= 0
              ? `Correct: ${letters[question.correctIndex]}`
              : 'No correct choice configured'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={() => {
              setEditing((value) => !value)
              setConfirmDelete(false)
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => {
                setConfirmDelete(true)
                setEditing(false)
              }}
            >
              Delete
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <Form route="questions.destroy" routeParams={{ id: question.id }}>
                {({ processing }) => (
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn--sm bg-red-800 text-white"
                  >
                    Confirm delete
                  </button>
                )}
              </Form>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <Form route="questions.update" routeParams={{ id: question.id }}>
          {({ errors, processing }) => (
            <div className="mt-6 space-y-4 border-t border-stone-200 pt-5">
              <label className="field" htmlFor={`question-text-${question.id}`}>
                <span className="field__label">Question text</span>
                <input
                  id={`question-text-${question.id}`}
                  name="text"
                  defaultValue={question.text}
                  maxLength={500}
                  required
                  className="field__input"
                />
              </label>
              {errors.text && <p className="field__error">{errors.text}</p>}
              <fieldset className="space-y-3">
                <legend className="font-semibold text-stone-900">Four answer choices</legend>
                {letters.map((letter, index) => (
                  <div
                    className="flex items-center gap-3 rounded-lg border border-stone-200 p-3"
                    key={letter}
                  >
                    <span className="font-semibold">{letter}.</span>
                    <input
                      name={`options[${index}][text]`}
                      aria-label={`Answer ${letter}`}
                      defaultValue={question.options[index]?.text ?? ''}
                      required
                      maxLength={250}
                      className="field__input min-w-0 flex-1"
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="correctIndex"
                        value={index}
                        defaultChecked={question.correctIndex === index}
                        required
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </fieldset>
              {errors.correctIndex && <p className="field__error">{errors.correctIndex}</p>}
              <button
                type="submit"
                className="btn bg-red-800 text-white hover:bg-red-900"
                disabled={processing}
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </Form>
      )}
    </article>
  )
}
