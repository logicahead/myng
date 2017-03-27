// App
import { Component, Input } from '@angular/core';

@Component({
  selector: 'list',
  template: '<span *ngFor="let user of users">{{ user }}</span>',
})
export class ListComponent {
  @Input() public users: Array<string> = [];
}


// App tests
import { async, inject, TestBed } from '@angular/core/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());


describe('ListComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent]
    });

    this.fixture = TestBed.createComponent(ListComponent);
  });

  it('should render list', async(() => {
    const element = this.fixture.nativeElement;
    this.fixture.componentInstance.users = ['John'];
    this.fixture.detectChanges();
    expect(element.querySelectorAll('span').length).toBe(1);
  }));

});



// App DI
class UserService {
  public users: Array<string> = ['John'];
}

@Component({
  selector: 'list',
  template: '<span *ngFor="let user of users">{{ user }}</span>',
})
class ListComponentBootstrapDI {
  private users: Array<string> = [];

  constructor(userService: UserService) {
    this.users = userService.users;
  }
}


class MockUserService {
  public users: Array<string> = ['John', 'Steve'];
}

describe('ListComponent DI', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponentBootstrapDI],
      providers: [{ provide: UserService, useClass: MockUserService }],
    });

    this.fixture = TestBed.createComponent(ListComponentBootstrapDI);
  });

  it('should render list', async(() => {
    const element = this.fixture.nativeElement;
    this.fixture.detectChanges();
    expect(element.querySelectorAll('span').length).toBe(2);
  }));

});


// App DI for Component
@Component({
  selector: 'list',
  template: '<span *ngFor="let user of users">{{ user }}</span>',
  providers: [UserService],
})
class ListComponentComponentDI {
  private users: Array<string> = [];

  constructor(userService: UserService) {
    this.users = userService.users;
  }
}

// App DI for Component tests
describe('ListComponent DI Component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponentBootstrapDI],
    });

    this.fixture = TestBed
      .overrideComponent(ListComponentBootstrapDI, {
        set: {
          providers: [{ provide: UserService, useClass: MockUserService }],
        },
      })
      .createComponent(ListComponentBootstrapDI);
  });

  it('should render list', async(() => {
    const element = this.fixture.nativeElement;
    this.fixture.detectChanges();
    expect(element.querySelectorAll('span').length).toBe(2);
  }));

});
