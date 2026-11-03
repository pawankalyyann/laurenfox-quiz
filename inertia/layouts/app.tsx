import Logo from '~/components/logo'
import { type ReactNode } from 'react'
import { ListChecks, Settings } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import FlashToasts from '~/components/flash_toasts'
import ThemeToggle from '~/components/theme_toggle'
import NavLink from '~/components/nav_link'

export default function AppLayout({ children }: { children: ReactNode }) {
  const { props } = usePage()
  const isAdmin = props.isAdmin === true

  return (
    <>
      <header className="header header--bar">
        <div className="header__inner">
          <Logo size={28} />
          <div className="header__right">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <nav className="subnav" aria-label="Main navigation">
        <div className="subnav__inner">
          <NavLink route="quiz" exact className="subnav__item">
            <ListChecks size={14} /> Quiz
          </NavLink>
          {isAdmin && (
            <>
              <NavLink route="configuration" exact className="subnav__item">
                <Settings size={14} /> Configuration
              </NavLink>
              <Form route="admin.logout">
                {({ processing }) => (
                  <button type="submit" className="subnav__item" disabled={processing}>
                    Sign out
                  </button>
                )}
              </Form>
            </>
          )}
        </div>
      </nav>
      <div className="app-main">{children}</div>
      <FlashToasts />
    </>
  )
}
