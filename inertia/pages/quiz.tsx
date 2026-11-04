import { useState, useRef } from 'react'
import { Head, useForm } from '@inertiajs/react'
import AppLayout from '~/layouts/app'
import { type Data } from '@generated/data'

function QuizContent({
  questions,
  attemptToken,
}: {
  questions: Data.Question[]
  attemptToken: string
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [current, setCurrent] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useForm({ answers: [] as { questionId: number; optionId: number }[], attemptToken })
  const answered = questions.filter((q) => answers[q.id] !== undefined).length
  const question = questions[current]
  function navigate(index: number) {
    setCurrent(index)
    requestAnimationFrame(() => heading.current?.focus())
  }
  function submit() {
    form.transform(() => ({
      attemptToken,
      answers: questions.map((q) => ({ questionId: q.id, optionId: answers[q.id] })),
    }))
    form.post('/quiz/submit')
  }
  return (
    <>
      <Head title="Assessment | Lauren Fox Quiz" />
      <p className="eyebrow">Level 03 / The assessment</p>
      <h1 className="quiz-title">
        Put your knowledge
        <br />
        <em>into perspective.</em>
      </h1>
      <p className="quiz-intro">
        Business meets technology. Choose one answer for each question, review your choices, and
        submit when you’re ready.
      </p>
      {!question ? (
        <div className="portal-panel" style={{ marginTop: 32 }}>
          No questions are available yet. Please check back soon.
        </div>
      ) : (
        <div className="quiz-grid">
          <section className="quiz-card" aria-label="Current question">
            <p className="eyebrow">
              Question {String(current + 1).padStart(2, '0')} /{' '}
              {String(questions.length).padStart(2, '0')}
            </p>
            <h2 className="question-heading" ref={heading} tabIndex={-1}>
              {question.text}
            </h2>
            <fieldset disabled={form.processing}>
              <legend className="sr-only">Choose one answer for {question.text}</legend>
              {question.options.map((option, index) => (
                <label
                  key={option.id}
                  className={`answer-choice ${answers[question.id] === option.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={answers[question.id] === option.id}
                    onChange={() => setAnswers({ ...answers, [question.id]: option.id })}
                  />
                  <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{option.text}</span>
                </label>
              ))}
            </fieldset>
            <div className="quiz-actions">
              <button
                className="secondary-button"
                disabled={current === 0 || form.processing}
                onClick={() => navigate(current - 1)}
              >
                ← Previous
              </button>
              {current < questions.length - 1 ? (
                <button
                  className="primary-button"
                  disabled={form.processing}
                  onClick={() => navigate(current + 1)}
                >
                  Next question →
                </button>
              ) : (
                <button
                  className="primary-button"
                  disabled={answered !== questions.length || form.processing}
                  onClick={submit}
                >
                  {form.processing ? 'Saving result…' : 'Submit assessment →'}
                </button>
              )}
            </div>
            {Object.values(form.errors).map((error, index) => (
              <p key={index} role="alert" className="portal-message">
                {error}
              </p>
            ))}
            <p className="portal-muted" style={{ marginTop: 20 }}>
              Your answers stay selected as you move between questions. Refreshing this page clears
              your selections.
            </p>
          </section>
          <aside className="portal-panel quiz-sidebar">
            <p className="eyebrow">Your progress</p>
            <h2 aria-live="polite">
              {answered} of {questions.length} answered
            </h2>
            <div
              className="portal-progress"
              role="progressbar"
              aria-label="Questions answered"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={answered}
            >
              <div style={{ width: `${(answered / questions.length) * 100}%` }} />
            </div>
            <div className="question-dots">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  disabled={form.processing}
                  onClick={() => navigate(index)}
                  aria-current={index === current ? 'step' : undefined}
                  aria-label={`Question ${index + 1}, ${answers[q.id] !== undefined ? 'answered' : 'unanswered'}`}
                  className={`${answers[q.id] !== undefined ? 'answered' : ''} ${index === current ? 'current' : ''}`}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <p className="portal-muted" style={{ marginTop: 24 }}>
              No timer. Take a moment to think.
              <br />
              Answer every question to submit.
            </p>
          </aside>
        </div>
      )}
    </>
  )
}
export default function Quiz(props: { questions: Data.Question[]; attemptToken: string }) {
  return <QuizContent key={props.attemptToken} {...props} />
}
Quiz.layout = [AppLayout]
