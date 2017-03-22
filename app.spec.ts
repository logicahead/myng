import {inject, TestBed} from '@angular/core/testing';

// Load the implementations that should be tested
import {App} from './app.component';
import {AppState} from './app.service';
import {AuthService} from './shared/auth.service';
import {SessionState} from './shared/session-state.service';
import {ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserActivityService} from './shared/user-activity.service';
import {LoanService} from './ui/loan/loan.service';
import {SaveLoanService} from './ui/shared/save-loan/save-loan.service';
import {WindowRefService} from './shared/window-ref.service';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      // AppState,
      App,
      {
        provide: AuthService,
        useValue: {
          initialize: jasmine.createSpy('initialize'),
          sessionExpiring$: jasmine.createSpyObj('sessionExpiring$', ['subscribe']),
          sessionExpired$: jasmine.createSpyObj('sessionExpired$', ['subscribe']),
          login$: jasmine.createSpyObj('login$', ['subscribe']),
          logout$: jasmine.createSpyObj('logout$', ['subscribe']),
          userRequestedLogout$: jasmine.createSpyObj('userRequestedLogout$', ['subscribe']),
        }
      },

      {provide: Router, useValue: {}},
      {provide: ActivatedRoute, useValue: {}},
      (() => {
        let windowSpy = jasmine.createSpyObj('Window', ['addEventListener']);
        return {provide: WindowRefService, useValue: {
          get nativeWindow() {
            return windowSpy;
          }
        }};
      })(),
      {provide: UserActivityService, useValue: {}},
      {provide: SessionState, useValue: {}},
      {provide: ViewContainerRef, useValue: {}},
      {provide: LoanService, useValue: {}},
      {provide: SaveLoanService, useValue: {}},
    ]
  }));

  it('can be instantiated', inject([App], (app: App) => {
    expect(app).toBeTruthy();
  }));

  it('initializes AuthService and subscribes to events', inject([App], (app: App) => {
    // spyOn(app, 'someMethod');
    let authServiceSpy = (TestBed.get(AuthService) as jasmine.Spy);

    expect(authServiceSpy['initialize']).not.toHaveBeenCalled();
    expect(authServiceSpy['sessionExpiring$']['subscribe']).not.toHaveBeenCalled();
    expect(authServiceSpy['sessionExpired$']['subscribe']).not.toHaveBeenCalled();
    expect(authServiceSpy['login$']['subscribe']).not.toHaveBeenCalled();
    expect(authServiceSpy['logout$']['subscribe']).not.toHaveBeenCalled();
    expect(authServiceSpy['userRequestedLogout$']['subscribe']).not.toHaveBeenCalled();

    app.ngOnInit();

    expect(authServiceSpy['initialize']).toHaveBeenCalled();
    expect(authServiceSpy['sessionExpiring$']['subscribe']).toHaveBeenCalled();
    expect(authServiceSpy['sessionExpired$']['subscribe']).toHaveBeenCalled();
    expect(authServiceSpy['login$']['subscribe']).toHaveBeenCalled();
    expect(authServiceSpy['logout$']['subscribe']).toHaveBeenCalled();
    expect(authServiceSpy['userRequestedLogout$']['subscribe']).toHaveBeenCalled();
  }));

});
