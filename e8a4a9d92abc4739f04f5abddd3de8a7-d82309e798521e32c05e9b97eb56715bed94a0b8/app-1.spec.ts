// App
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: '<span>{{ sayHello() }}</span>',
})
export class App {
  public name: string = 'John';

  sayHello(): string {
    return `Hello ${this.name}`;
  }
}


// App tests

describe('App', () => {

  beforeEach(() => {
    this.app = new App();
  });

  it('should have name property', () => {
    expect(this.app.name).toBe('John');
  });

  it('should say hello with name property', () => {
    expect(this.app.sayHello()).toBe('Hello John');
  });

});
