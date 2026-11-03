import { Head } from '@inertiajs/react'

export default function RegistrationPending() {
  return (
    <>
      <Head title="Verification | Lauren Fox Quiz" />

      <main className="flex min-h-screen items-center justify-center bg-[#0b090b] px-5 text-white">
        <section className="w-full max-w-lg rounded-3xl border border-red-900/60 bg-[#181114] p-10 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
            Level 02 / Verification
          </p>

          <h1 className="mb-4 text-4xl font-black">Registration received.</h1>

          <p className="text-white/60">
            Your registration has been recorded. Email verification is not enabled yet. This is a
            development preview. No verification email has been sent.
          </p>

          <p className="mt-8 text-xs uppercase tracking-widest text-white/40">
            Lauren Fox Quiz · Secure Assessment
          </p>
        </section>
      </main>
    </>
  )
}
