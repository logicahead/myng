// App
class TestService {
  public name: string = 'Injected Service';
}


// App tests
import { inject, TestBed } from '@angular/core/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


describe('TestService', () => {

  beforeEach(() => {
    this.testService = new TestService();
  });

  it('should have name property set', () => {
    expect(this.testService.name).toBe('Injected Service');
  });

});


describe('TestService Injected', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestService],
    });
  });

  it('should have name property set', inject([TestService], (testService: TestService) => {
    expect(testService.name).toBe('Injected Service');
  }));

});


class MockTestService {
  public mockName: string = 'Mocked Service';
}

describe('TestService Mocked', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TestService, useClass: MockTestService }],
    });
  });

  it('should have name property set', inject([TestService], (testService: TestService) => {
    expect(testService.mockName).toBe('Mocked Service');
  }));

});


class MockTestServiceInherited extends TestService {
  public sayHello(): string {
    return this.name;
  }
}

describe('TestService Mocked Inherited', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TestService, useClass: MockTestServiceInherited }],
    });
  });

  it('should say hello with name', inject([TestService], (testService: TestService) => {
    expect(testService.sayHello()).toBe('Injected Service');
  }));

});
