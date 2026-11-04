import { Head, useForm } from '@inertiajs/react'
import AppLayout from '~/layouts/app'

export default function RegistrationPending({ email }: { email: string }) {
  const form = useForm({ code: '' })
  const resend = useForm({})
  return (
    <>
      <Head title="Verify email | Lauren Fox Quiz" />
      <section className="portal-panel verify-panel">
        <p className="eyebrow">Level 02 / Email verification</p>
        <h1>
          One code.
          <br />
          You’re almost in.
        </h1>
        <p className="portal-muted">
          Enter the six-digit code for <strong>{email}</strong>. Codes expire after 10 minutes.
          Check the delivery message below if it hasn’t arrived.
        </p>
        <form
          style={{ marginTop: 28 }}
          onSubmit={(event) => {
            event.preventDefault()
            form.post('/verify-email')
          }}
        >
          <label htmlFor="verification-code">Verification code</label>
          <input
            id="verification-code"
            className="otp-input"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={form.data.code}
            onChange={(e) => form.setData('code', e.target.value.replace(/\D/g, ''))}
          />
          <button
            className="primary-button"
            style={{ width: '100%' }}
            disabled={form.processing || resend.processing || form.data.code.length !== 6}
          >
            {form.processing ? 'Verifying…' : 'Verify & continue →'}
          </button>
        </form>
        <div className="quiz-actions">
          <button
            className="secondary-button"
            disabled={resend.processing || form.processing}
            onClick={() => resend.post('/verify-email/resend')}
          >
            {resend.processing ? 'Sending…' : 'Resend code'}
          </button>
          <a className="secondary-button" href="/register">
            Change email
          </a>
        </div>
        <p className="portal-muted" style={{ marginTop: 20 }}>
          Wait at least one minute between requests. Only your newest code will work.
        </p>
      </section>
    </>
  )
}
RegistrationPending.layout = [AppLayout]
