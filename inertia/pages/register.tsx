import { Head, useForm } from '@inertiajs/react'
import type { FormEvent } from 'react'
import FlashToasts from '~/components/flash_toasts'

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    fullName: '',
    email: '',
    phone: '',
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    post('/register')
  }

  return (
    <>
      <Head title="Register | Lauren Fox Quiz" />

      <main className="flex min-h-screen items-center justify-center bg-[#0b090b] px-5 py-12 text-white">
        <div className="w-full max-w-xl">
          <header className="mb-10 flex items-center justify-between">
            <a href="/welcome" className="text-sm text-white/60 hover:text-white">
              ← Back
            </a>
            <span className="text-sm font-black tracking-widest">
              LAUREN FOX <span className="text-red-500">QUIZ</span>
            </span>
          </header>

          <section className="rounded-3xl border border-red-900/60 bg-[#181114] p-8 shadow-2xl shadow-red-950/30 sm:p-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Level 01 / Participant details
            </p>

            <h1 className="mb-3 text-4xl font-black tracking-tight">Before we begin.</h1>

            <p className="mb-8 text-sm leading-6 text-white/60">
              Enter your details to register for the assessment. We’ll email you a six-digit code to
              verify your address before you begin.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={data.fullName}
                  onChange={(e) => setData('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500"
                />
                {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-semibold">
                  Phone number (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={32}
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="+1 405 000 0000"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500"
                />
                {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-[#b30820] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#d20b29] disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Continue to verification →'}
              </button>
            </form>
          </section>

          <p className="mt-6 text-center text-xs uppercase tracking-widest text-white/30">
            Lauren Fox Quiz · Knowledge Assessment
          </p>
        </div>
      </main>
      <FlashToasts />
    </>
  )
}
