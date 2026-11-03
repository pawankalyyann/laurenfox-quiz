import { type Data } from '@generated/data'

type Props = {
  question: Data.Question
  number: number
  selectedOptionId?: number
  onSelect: (optionId: number) => void
}

export default function QuestionView({ question, number, selectedOptionId, onSelect }: Props) {
  const options = question.options ?? []

  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-800">
        Question {String(number).padStart(2, '0')}
      </p>
      <h3 className="mb-5 text-lg font-semibold">{question.text}</h3>

      {options.length === 0 ? (
        <p className="text-amber-700">No answer choices configured.</p>
      ) : (
        <fieldset className="space-y-3">
          <legend className="sr-only">Select an answer for {question.text}</legend>

          {options.map((option, index) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3
                rounded-lg border p-4 transition-colors
                ${
                  selectedOptionId === option.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={selectedOptionId === option.id}
                onChange={() => onSelect(option.id)}
                className="h-4 w-4"
              />

              <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>

              <span>{option.text}</span>
            </label>
          ))}
        </fieldset>
      )}
    </article>
  )
}
