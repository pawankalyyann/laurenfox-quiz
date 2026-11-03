/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  quiz: typeof routes['quiz'] & {
    submit: typeof routes['quiz.submit']
    results: typeof routes['quiz.results']
  }
  admin: {
    login: typeof routes['admin.login'] & {
      submit: typeof routes['admin.login.submit']
    }
    logout: typeof routes['admin.logout']
  }
  configuration: typeof routes['configuration']
  questions: {
    store: typeof routes['questions.store']
    update: typeof routes['questions.update']
    destroy: typeof routes['questions.destroy']
  }
  welcome: typeof routes['welcome']
}
