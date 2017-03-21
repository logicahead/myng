import {LogLevel} from './shared/logger.service';

let settings = {
  API: {
    URL: 'https://s-cp-ldts-dev1.ld.corp.local:8100',
    NAME_SPACE: 'api/v1'
  },
  DUO_HOST: 'api-0815f60f.duosecurity.com',
  LOGGING: {
    levels: [LogLevel.ERROR, LogLevel.WARN, LogLevel.DEBUG, LogLevel.INFO],
    SENTRY: {
      publicDsn: 'https://bd5a494a3faf4dc888989f5d0fecdbde@sentry.io/115234'
    }
  },
  AUTHENTICATION: {
    SESSION_RESTORATION_ENABLED: true,
    MINIMUM_SECONDS_REMAINING_TO_RESTORE_SESSION: 180,
    SECONDS_BEFORE_SESSION_EXPIRATION_TO_NOTIFY: 120,
    SECONDS_BEFORE_CONSIDERED_INACTIVE: 300
  },
  ERROR_HANDLER_OPTIONS: {
    rethrowError: false
  },
  // IS_MOCK_ENABLED: false,
  IS_MOCK_ENABLED: ('production' !== ENV) || !!getCookie('mock'),
};

if ('production' === ENV) {
  // settings.AUTHENTICATION.SESSION_RESTORATION_ENABLED = false;

} else {

}

export const SETTINGS = settings;

function getCookie(name) {
  let value = '; ' + document.cookie;
  let parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}

https://www.learnrxjs.io/operators/utility/topromise.html
https://codeload.github.com/anureddy94/angular2-practice/zip/master
https://codeload.github.com/Gogogogogogo/Angular2-LearnViewContainerRef/zip/master
https://codeload.github.com/doxiaodong/darlin-angular2/zip/master
https://codeload.github.com/TinNguyen331/Angular2-BomShop/zip/master
