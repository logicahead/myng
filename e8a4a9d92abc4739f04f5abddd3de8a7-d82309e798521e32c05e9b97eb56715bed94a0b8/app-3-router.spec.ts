// App
import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`
})
class AppComponent {}

// App tests
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('AppComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule]
    });
  });

  it('should be able to test', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.whenStable().then(() => {
      expect(true).toBe(true);
    });
  }));

});
