import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'admin_login': ExtractProps<(typeof import('../../inertia/pages/admin_login.tsx'))['default']>
    'configuration': ExtractProps<(typeof import('../../inertia/pages/configuration.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'quiz': ExtractProps<(typeof import('../../inertia/pages/quiz.tsx'))['default']>
    'register': ExtractProps<(typeof import('../../inertia/pages/register.tsx'))['default']>
    'registration_pending': ExtractProps<(typeof import('../../inertia/pages/registration_pending.tsx'))['default']>
    'results': ExtractProps<(typeof import('../../inertia/pages/results.tsx'))['default']>
    'welcome': ExtractProps<(typeof import('../../inertia/pages/welcome.tsx'))['default']>
  }
}
