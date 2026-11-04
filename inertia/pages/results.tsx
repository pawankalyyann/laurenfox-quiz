import Page from '~/components/page'
import AppLayout from '~/layouts/app'

type QuizResult = {
  correct: number
  total: number
  percentage: number
  details: { question: string; selectedAnswer: string; correctAnswer: string; isCorrect: boolean }[]
}
export default function Results({ result }: { result: QuizResult }) {
  return (
    <Page title="Your results" hideTitle>
      <section className="portal-panel">
        <p className="eyebrow">Level 04 / Assessment complete</p>
        <h1 className="quiz-title">
          Every answer.
          <br />A step forward.
        </h1>
        <p className="score-number">
          {result.percentage}
          <span style={{ fontSize: '0.45em' }}>%</span>
        </p>
        <p className="quiz-intro">
          {result.correct} correct out of {result.total} questions. Your result has been saved.
        </p>
        <div className="quiz-actions" style={{ justifyContent: 'flex-start' }}>
          <a className="primary-button" href="/">
            Try again →
          </a>
          <a className="secondary-button" href="/welcome">
            Back to welcome
          </a>
        </div>
      </section>
      <section className="review-list" aria-label="Answer review">
        <h2>Your answer review</h2>
        {result.details.map((detail, index) => (
          <article className="portal-panel" key={index}>
            <div className="review-status">
              {detail.isCorrect ? '✓ Correct' : '× Incorrect'} / Question{' '}
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3>{detail.question}</h3>
            <p>
              <strong>Your answer:</strong> {detail.selectedAnswer}
            </p>
            {!detail.isCorrect && (
              <p>
                <strong>Correct answer:</strong> {detail.correctAnswer}
              </p>
            )}
          </article>
        ))}
      </section>
    </Page>
  )
}
Results.layout = [AppLayout]
