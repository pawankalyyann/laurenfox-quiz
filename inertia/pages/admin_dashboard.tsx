import Page from '~/components/page'
import AppLayout from '~/layouts/app'

type Props = {
  stats: { participants: number; verified: number; attempts: number }
  participants: {
    id: number
    full_name: string
    email: string
    email_verified: boolean
    created_at: string
  }[]
  attempts: { id: number; full_name: string; correct: number; total: number; created_at: string }[]
  page: number
  hasNext: boolean
}
export default function AdminDashboard({ stats, participants, attempts, page, hasNext }: Props) {
  return (
    <Page
      title="Assessment overview"
      description="Your private workspace for participants, verification status, and saved scores."
    >
      <div className="stats-grid">
        {Object.entries(stats).map(([label, value]) => (
          <div className="portal-panel" key={label}>
            <p className="eyebrow">{label}</p>
            <p className="stat-value">{value}</p>
          </div>
        ))}
      </div>
      <section className="portal-panel">
        <h2 style={{ fontSize: 24, fontWeight: 750 }}>Participants</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>{p.email}</td>
                  <td>{p.email_verified ? 'Verified' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {participants.length === 0 && <p className="portal-muted">No participants on this page.</p>}
      </section>
      <section className="portal-panel" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 750 }}>Saved results</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Participant</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Submitted (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td>{a.full_name}</td>
                  <td>
                    {a.correct} / {a.total}
                  </td>
                  <td>{Math.round((a.correct / a.total) * 100)}%</td>
                  <td>{a.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {attempts.length === 0 && <p className="portal-muted">No results on this page.</p>}
      </section>
      <nav className="quiz-actions" aria-label="Dashboard pages">
        {page > 1 && (
          <a className="secondary-button" href={`?page=${page - 1}`}>
            ← Previous
          </a>
        )}
        <span>Page {page}</span>
        {hasNext && (
          <a className="secondary-button" href={`?page=${page + 1}`}>
            Next →
          </a>
        )}
      </nav>
    </Page>
  )
}
AdminDashboard.layout = [AppLayout]
