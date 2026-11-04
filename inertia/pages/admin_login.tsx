import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { Form } from '@adonisjs/inertia/react'

export default function AdminLogin() {
  return (
    <Page
      title="Administrator Sign In"
      description="Question configuration is restricted to authorized reviewers and administrators."
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-stone-900">Lauren Fox Quiz · Administration</h2>
        <p className="mt-2 text-sm text-stone-600">
          Enter the administrator access key to manage questions.
        </p>
        <Form route="admin.login.submit">
          {({ processing }) => (
            <div className="mt-6 flex flex-col gap-4">
              <label className="field" htmlFor="admin-password">
                <span className="field__label">Access key</span>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="field__input"
                />
              </label>
              <button
                className="rounded-lg bg-red-800 px-5 py-3 font-semibold text-white hover:bg-red-900 disabled:opacity-50"
                type="submit"
                disabled={processing}
              >
                {processing ? 'Checking...' : 'Sign in'}
              </button>
            </div>
          )}
        </Form>
      </div>
    </Page>
  )
}

AdminLogin.layout = [AppLayout]
