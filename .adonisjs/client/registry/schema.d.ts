/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'quiz': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['index']>>>
    }
  }
  'quiz.submit': {
    methods: ["POST"]
    pattern: '/quiz/submit'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/quiz_submission').quizSubmissionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/quiz_submission').quizSubmissionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'quiz.results': {
    methods: ["GET","HEAD"]
    pattern: '/quiz/results'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['results']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['results']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['results']>>>
    }
  }
  'admin.login': {
    methods: ["GET","HEAD"]
    pattern: '/admin/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['login']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['login']>>>
    }
  }
  'admin.login.submit': {
    methods: ["POST"]
    pattern: '/admin/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['authenticate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['authenticate']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['authenticate']>>>
    }
  }
  'admin.logout': {
    methods: ["POST"]
    pattern: '/admin/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['logout']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['logout']>>>
    }
  }
  'configuration': {
    methods: ["GET","HEAD"]
    pattern: '/configuration'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['create']>>>
    }
  }
  'questions.store': {
    methods: ["POST"]
    pattern: '/questions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/question').createQuestionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/question').createQuestionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'questions.update': {
    methods: ["PUT"]
    pattern: '/questions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/question').createQuestionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/question').createQuestionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'questions.destroy': {
    methods: ["DELETE"]
    pattern: '/questions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['destroy']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/questions_controller').default['destroy']>>>
    }
  }
  'welcome': {
    methods: ["GET","HEAD"]
    pattern: '/welcome'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
      rawResponse: ExtractRawResponse<unknown>
    }
  }
  'registration.create': {
    methods: ["GET","HEAD"]
    pattern: '/register'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['create']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['create']>>>
    }
  }
  'registration.store': {
    methods: ["POST"]
    pattern: '/register'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/participant').registerParticipantValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/participant').registerParticipantValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'registration.pending': {
    methods: ["GET","HEAD"]
    pattern: '/verify-email'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['pending']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['pending']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/participants_controller').default['pending']>>>
    }
  }
}
