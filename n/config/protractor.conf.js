/**
 * @author: @AngularClass
 */

require('ts-node/register');
var helpers = require('./helpers');
var trx = require('jasmine-trx-reporter');

var domain = 'localhost:4200';
var url = 'http://' + domain + '/';

exports.config = {
  baseUrl: url,

  // use `npm run e2e`
  specs: [
    helpers.root('src/**/**.e2e.ts'),
    helpers.root('src/**/*.e2e.ts')
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true']
    }
  },

  onPrepare: function() {
    browser.ignoreSynchronization = true;

    return browser.getCapabilities().then(function (caps) {
      // var browserName = caps.get('browserName').toUpperCase();
      // var browserVersion = caps.get('version');
      var jasmineTrxConfig = {
        reportName: 'e2e',
        // folder: 'e2e-test-results',
        outputFile: 'e2e-test-results.trx',
        // browser: browserName + "_" + browserVersion,
        groupSuitesIntoSingleFile: true
      };

      jasmine.getEnv().addReporter(new trx(jasmineTrxConfig));

      return browser.driver.get(url).then(function () {
        return browser.manage().addCookie('mock', '1', '/', domain).then(function () {
          var expires = new Date();
          var expirationSeconds = 600000;
          expires.setSeconds(expires.getSeconds() + expirationSeconds);

          var sessionState = {
            "authenticated": true,
            "username": "protractor",
            "data": {
              "userGuid": "00000000-protractor-userGuid-00000000",
              "token": "00000000-protractor-token-00000000",
              "expires": expires.toJSON(),
              "expirationSeconds": expirationSeconds
            }
          };

          return browser.executeScript("window.localStorage['sessionState'] = '" + JSON.stringify(sessionState) + "';");
        });
      });
    });
  },

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   */
   useAllAngular2AppRoots: true
};
