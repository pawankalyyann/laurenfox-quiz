import { Head } from '@inertiajs/react'
import '../css/lauren-fox-welcome.css'

export default function Welcome() {
  return (
    <>
      <Head title="Lauren Fox Quiz | Welcome" />

      <div className="lf-page">
        <div className="lf-grid" aria-hidden="true" />

        <header className="lf-header">
          <a href="/welcome" className="lf-brand">
            <span className="lf-logo">LF.</span>
            <span>
              LAUREN FOX <strong>QUIZ</strong>
            </span>
          </a>

          <div className="lf-status">
            <span className="lf-status-dot" />
            ASSESSMENT READY
          </div>
        </header>

        <main className="lf-main">
          <section className="lf-hero">
            <div className="lf-eyebrow">
              <span className="lf-eyebrow-line" />
              WELCOME TO THE CHALLENGE
            </div>

            <h1>
              THINK
              <br />
              <span>SHARP.</span>
              <br />
              PLAY SMARTER.
            </h1>

            <p className="lf-description">
              Test your knowledge of Management Information Systems, SQL, cybersecurity, cloud
              computing, and modern technology.
            </p>

            <div className="lf-stats">
              <div>
                <strong>10</strong>
                <span>QUESTIONS</span>
              </div>

              <div>
                <strong>04</strong>
                <span>CHOICES EACH</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>YOUR TARGET</span>
              </div>
            </div>

            <a href="/" className="lf-start">
              START THE CHALLENGE
              <span aria-hidden="true">↗</span>
            </a>

            <p className="lf-note">
              Select your answers. Submit your quiz. See your score instantly.
            </p>
          </section>

          <div className="lf-visual" aria-hidden="true">
            <div className="lf-orbit lf-orbit-one" />
            <div className="lf-orbit lf-orbit-two" />

            <div className="lf-visual-card">
              <div className="lf-card-top">
                <span>LF / KNOWLEDGE ENGINE</span>
                <span>01—10</span>
              </div>

              <div className="lf-question-mark">?</div>

              <div className="lf-card-bottom">
                <span>CHALLENGE YOUR LIMITS</span>
                <span className="lf-ready">● READY</span>
              </div>
            </div>

            <div className="lf-floating lf-floating-top">SQL // DATA // ANALYTICS</div>

            <div className="lf-floating lf-floating-bottom">THINK. CHOOSE. ACHIEVE.</div>
          </div>
        </main>

        <footer className="lf-footer">
          <span>© 2026 LAUREN FOX QUIZ</span>
          <span>BUILT FOR CURIOUS MINDS.</span>
        </footer>
      </div>
    </>
  )
}
