import { Injector } from '@angular/core'
import { HttpModule, RequestOptions, XHRBackend, Http, Response, ResponseOptions, ResponseType } from '@angular/http'
import { inject, TestBed } from '@angular/core/testing'
import { MockBackend, MockConnection } from '@angular/http/testing'

import { AuthService } from './auth.service'
import { Oauth2Http } from './http'
import { CookieService } from '../../cookie/ng2'
import { MockError } from '../../util/ng2/test'

describe('oauth2 Http service', () => {
  let mockbackend: MockBackend,
    http: Oauth2Http,
    cookieService: CookieService,
    service: AuthService

  const authData = {
    access_token: 'test_access_token',
    refresh_token: 'test_refresh_token',
    expires_in: 3600
  }

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpModule
    ],
    providers: [
      MockBackend,
      CookieService,
      AuthService,
      {
        provide: Http,
        useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, injector: Injector
        ) => new Oauth2Http(xhrBackend, requestOptions, injector),
        deps: [MockBackend, RequestOptions, Injector]
      }
    ]
  }))

  beforeEach(inject([Http, MockBackend, CookieService, AuthService], (_http, _mockbackend, _cookieService, _service) => {
    cookieService = _cookieService
    http = _http
    mockbackend = _mockbackend
    service = _service

  }))

  describe('user not authorized', () => {
    let tape

    beforeEach(() => {
      tape = {
        emitError: () => { },
        httpFail: () => { }
      }

      spyOn(tape, 'emitError')
      spyOn(tape, 'httpFail')

      service.removeAuthData()
    })

    describe('server response 401 status code to some request', () => {

      it(`request should be failed by default behavior`, (done) => {
        mockbackend.connections.subscribe((c: MockConnection) => {
          let responseOptions = new ResponseOptions({ body: {}, status: 401, type: ResponseType.Error, url: '' })
          c.mockError(new MockError(responseOptions))
        })

        http.get('/protected')
          .subscribe(
            () => {},
            tape.httpFail
          )

        http.errorEmmiter.subscribe((evt) => {
          expect(evt).toBe('alert.session_expired')
          expect(tape.httpFail).toHaveBeenCalled()
          done()
        })
      })

    })
  })

  describe('user was authorized, acesss token expired', () => {
    let tape

    beforeEach(() => {
      tape = {
        emitError: () => { },
        httpFail: () => { }
      }

      spyOn(tape, 'emitError')
      spyOn(tape, 'httpFail')

      service.setAuthData(Object.assign({}, authData, { access_token: 'expired_token' }))
    })

    describe('server response 401 status code to some request', () => {

      it(`request should be recovered through authService.refreshToken() method call`, (done) => {
        mockbackend.connections.subscribe((c: MockConnection) => {
          let responseOptions

          switch (c.request.url) {
            case '/protected':
              let authorization = c.request.headers.get('Authorization')

              if (authorization === 'bearer expired_token') {
                responseOptions = new ResponseOptions({ body: {}, status: 401, type: ResponseType.Error, url: '' })
                c.mockError(new MockError(responseOptions))
              } else {
                responseOptions = new ResponseOptions({ body: {} })
                c.mockRespond(new Response(responseOptions))
              }
              break

            case '/oauth/token?client_id=&grant_type=refresh_token&refresh_token=test_refresh_token':
              responseOptions = new ResponseOptions({ body: JSON.stringify(authData), status: 200, type: ResponseType.Error, url: '' })
              c.mockRespond(new Response(responseOptions))
              break
          }
        })

        http.get('/protected')
          .subscribe(
            () => {
              done()
              expect(tape.emitError).not.toHaveBeenCalled()
            }
          )

        http.errorEmmiter.subscribe(tape.emitError)
      })

    })
  })

  describe('user was authorized, acesss token not expired', () => {
    let tape

    beforeEach(() => {
      tape = {
        emitError: () => { },
        httpFail: () => { }
      }

      spyOn(tape, 'emitError')
      spyOn(tape, 'httpFail')

      service.setAuthData(authData)
    })

    describe('server response 200 OK', () => {

      it(`request should be resolved like with default Http service`, (done) => {
        mockbackend.connections.subscribe((c: MockConnection) => {
          let responseOptions = new ResponseOptions({ body: {} })
          c.mockRespond(new Response(responseOptions))
        })

        http.get('/protected')
          .subscribe(
            () => {
              done()
              expect(tape.emitError).not.toHaveBeenCalled()
            }
          )

        http.errorEmmiter.subscribe(tape.emitError)
      })

    })
  })


})