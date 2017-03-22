/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthorsrsService } from './authorsrs.service';

describe('Service: Authorsrs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorsrsService]
    });
  });

  it('should ...', inject([AuthorsrsService], (service: AuthorsrsService) => {
    expect(service).toBeTruthy();
  }));
});
