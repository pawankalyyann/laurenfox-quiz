import { Form } from '@adonisjs/inertia/react'

const choices = ['A', 'B', 'C', 'D']

export default function QuestionForm() {
  return (
    <Form route="questions.store" resetOnSuccess>
      {({ errors, processing }) => (
        <div className="flex flex-col gap-5">
          <div className="field">
            <label className="field__label" htmlFor="text">
              Question
            </label>

            <input
              id="text"
              name="text"
              type="text"
              className="field__input"
              placeholder="Enter your MIS question"
              maxLength={500}
              required
              aria-invalid={Boolean(errors.text)}
            />

            {errors.text && <span className="field__error">{errors.text}</span>}
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-semibold">Answer Choices</legend>

            <p className="text-sm text-gray-500">Enter four answers and select the correct one.</p>

            {choices.map((choice, index) => (
              <div key={choice} className="panel flex items-center gap-3 p-4">
                <span className="font-semibold">{choice}</span>

                <input
                  type="text"
                  name={`options[${index}][text]`}
                  id={`option-${index}`}
                  className="field__input flex-1"
                  placeholder={`Answer ${choice}`}
                  maxLength={250}
                  aria-label={`Answer ${choice}`}
                  required
                />

                <label htmlFor={`correct-${index}`} className="flex items-center gap-2 text-sm">
                  <input
                    id={`correct-${index}`}
                    type="radio"
                    name="correctIndex"
                    value={index}
                    defaultChecked={index === 0}
                    required
                  />
                  Correct
                </label>
              </div>
            ))}
          </fieldset>

          {errors.correctIndex && <p className="field__error">{errors.correctIndex}</p>}

          <button type="submit" className="btn btn--primary" disabled={processing}>
            {processing ? 'Saving...' : 'Add Question'}
          </button>
        </div>
      )}
    </Form>
  )
}
