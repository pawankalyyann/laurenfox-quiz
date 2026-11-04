/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'quiz': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['quiz']['types'],
  },
  'quiz.submit': {
    methods: ["POST"],
    pattern: '/quiz/submit',
    tokens: [[0,"quiz"],[0,"submit"]],
    types: placeholder as Registry['quiz.submit']['types'],
  },
  'quiz.results': {
    methods: ["GET","HEAD"],
    pattern: '/quiz/results',
    tokens: [[0,"quiz"],[0,"results"]],
    types: placeholder as Registry['quiz.results']['types'],
  },
  'admin.login': {
    methods: ["GET","HEAD"],
    pattern: '/admin/login',
    tokens: [[0,"admin"],[0,"login"]],
    types: placeholder as Registry['admin.login']['types'],
  },
  'admin.login.submit': {
    methods: ["POST"],
    pattern: '/admin/login',
    tokens: [[0,"admin"],[0,"login"]],
    types: placeholder as Registry['admin.login.submit']['types'],
  },
  'admin.logout': {
    methods: ["POST"],
    pattern: '/admin/logout',
    tokens: [[0,"admin"],[0,"logout"]],
    types: placeholder as Registry['admin.logout']['types'],
  },
  'configuration': {
    methods: ["GET","HEAD"],
    pattern: '/configuration',
    tokens: [[0,"configuration"]],
    types: placeholder as Registry['configuration']['types'],
  },
  'questions.store': {
    methods: ["POST"],
    pattern: '/questions',
    tokens: [[0,"questions"]],
    types: placeholder as Registry['questions.store']['types'],
  },
  'questions.update': {
    methods: ["PUT"],
    pattern: '/questions/:id',
    tokens: [[0,"questions"],[1,"id"]],
    types: placeholder as Registry['questions.update']['types'],
  },
  'questions.destroy': {
    methods: ["DELETE"],
    pattern: '/questions/:id',
    tokens: [[0,"questions"],[1,"id"]],
    types: placeholder as Registry['questions.destroy']['types'],
  },
  'welcome': {
    methods: ["GET","HEAD"],
    pattern: '/welcome',
    tokens: [[0,"welcome"]],
    types: placeholder as Registry['welcome']['types'],
  },
  'registration.create': {
    methods: ["GET","HEAD"],
    pattern: '/register',
    tokens: [[0,"register"]],
    types: placeholder as Registry['registration.create']['types'],
  },
  'registration.store': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [[0,"register"]],
    types: placeholder as Registry['registration.store']['types'],
  },
  'registration.pending': {
    methods: ["GET","HEAD"],
    pattern: '/verify-email',
    tokens: [[0,"verify-email"]],
    types: placeholder as Registry['registration.pending']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
