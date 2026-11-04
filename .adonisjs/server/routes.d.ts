import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'quiz': { paramsTuple?: []; params?: {} }
    'quiz.submit': { paramsTuple?: []; params?: {} }
    'quiz.results': { paramsTuple?: []; params?: {} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'admin.login.submit': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'configuration': { paramsTuple?: []; params?: {} }
    'questions.store': { paramsTuple?: []; params?: {} }
    'questions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'questions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'welcome': { paramsTuple?: []; params?: {} }
    'registration.create': { paramsTuple?: []; params?: {} }
    'registration.store': { paramsTuple?: []; params?: {} }
    'registration.pending': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'quiz': { paramsTuple?: []; params?: {} }
    'quiz.results': { paramsTuple?: []; params?: {} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'configuration': { paramsTuple?: []; params?: {} }
    'welcome': { paramsTuple?: []; params?: {} }
    'registration.create': { paramsTuple?: []; params?: {} }
    'registration.pending': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'quiz': { paramsTuple?: []; params?: {} }
    'quiz.results': { paramsTuple?: []; params?: {} }
    'admin.login': { paramsTuple?: []; params?: {} }
    'configuration': { paramsTuple?: []; params?: {} }
    'welcome': { paramsTuple?: []; params?: {} }
    'registration.create': { paramsTuple?: []; params?: {} }
    'registration.pending': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'quiz.submit': { paramsTuple?: []; params?: {} }
    'admin.login.submit': { paramsTuple?: []; params?: {} }
    'admin.logout': { paramsTuple?: []; params?: {} }
    'questions.store': { paramsTuple?: []; params?: {} }
    'registration.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'questions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'questions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}