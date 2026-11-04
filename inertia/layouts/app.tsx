import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import FlashToasts from '~/components/flash_toasts'
import '~/css/portal.css'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { props, flash } = usePage()
  const isAdmin = props.isAdmin === true
  return (
    <div className="portal">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="portal-header">
        <a className="portal-brand" href="/welcome">
          LAUREN FOX<span>QUIZ /</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="/">Assessment</a>
          {isAdmin && (
            <>
              <a href="/admin/dashboard">Dashboard</a>
              <a href="/configuration">Questions</a>
              <Form route="admin.logout">
                {({ processing }) => (
                  <button type="submit" disabled={processing}>
                    Sign out
                  </button>
                )}
              </Form>
            </>
          )}
        </nav>
      </header>
      <main id="main-content" className="portal-main">
        {(flash.error || flash.success) && (
          <div className="portal-message" role={flash.error ? 'alert' : 'status'}>
            {flash.error || flash.success}
          </div>
        )}
        {children}
      </main>
      <footer className="portal-footer">
        <span>LAUREN FOX / KNOWLEDGE ASSESSMENT</span>
        <span>Think. Choose. Achieve.</span>
      </footer>
      <FlashToasts />
    </div>
  )
}
