import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  getPersistentValue(property: string, loanId?: string): any {
    if (loanId) {
      property = `${property}:${loanId}`;
    }
    return JSON.parse(localStorage.getItem(property));
  };

  setPersistentValue(property: string, value: any, loanId?: string) {
    if (loanId) {
      property = `${property}:${loanId}`;
    }
    localStorage.setItem(property, JSON.stringify(value));
  }

  getSessionValue(property: string, loanId?: string): any {
    if (loanId) {
      property = `${property}:${loanId}`;
    }
    return JSON.parse(sessionStorage.getItem(property));
  };


  setSessionValue(property: string, value: any, loanId?: string) {
    if (loanId) {
      property = `${property}:${loanId}`;
    }
    sessionStorage.setItem(property, JSON.stringify(value));
  }

}
