import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';

import {LoanDataService} from '../data/loan.data.service';
import {Mortgage} from '../models/Mortgage';
import {ApiError} from '../api/v1';
import {UserNotificationService} from '../shared/user-notification.service';


@Injectable()
export class LoanEffects {
  constructor(private actions$: Actions,
              private loanDataService: LoanDataService,
              private userNotificationService: UserNotificationService) {
  }

  @Effect() loadLoan$ = this.actions$
    .ofType('LOAD_LOAN')
    .switchMap((action) => {
      let payload: {id: string} = action.payload;
      return this.loanDataService.getMortgage(payload.id)
        .map((mortgage: Mortgage) => {
          return {
            type: 'LOAN_LOADED',
            payload: mortgage
          };
        })
        .catch((errors: ApiError[]) => {
          return Observable.of({
            type: 'LOAN_LOAD_FAILURE',
            payload: errors
          });
        });
    });

  @Effect() loadNewLoan$ = this.actions$
    .ofType('LOAD_NEW_LOAN')
    .map((action) => {
      let mortgage: Mortgage = action.payload;
      return {
        type: 'LOAN_LOADED',
        payload: mortgage
      };
    })
    .catch((errors: any) => {
      return Observable.of({
        type: 'LOAN_LOAD_FAILURE',
        payload: errors
      });
    });

  @Effect() saveLoan$ = this.actions$
    .ofType('SAVE_LOAN')
    .switchMap((action) => {
      let mortgage: Mortgage = action.payload;
      return this.loanDataService.updateMortgage(mortgage.id, mortgage)
        .map((updatedMortgage: Mortgage) => {
          return {
            type: 'LOAN_SAVED',
            payload: updatedMortgage
          };
        })
        .catch((error: any) => {
          return Observable.of({
            type: 'LOAN_SAVE_FAILURE',
            payload: error
          });
        });
    });

  @Effect() saveNewLoan$ = this.actions$
    .ofType('SAVE_NEW_LOAN')
    .switchMap((action) => {
      let mortgage: Mortgage = action.payload;
      return this.loanDataService.saveNewMortgage(mortgage)
        .map((mortgage: Mortgage) => {
          return {
            type: 'LOAN_SAVED',
            payload: mortgage
          };
        })
        .catch((error: any) => {
          return Observable.of({
            type: 'LOAN_SAVE_FAILURE',
            payload: error
          });
        });
    });

  @Effect() loadLoanFailure$ = this.actions$
    .ofType('LOAN_LOAD_FAILURE', 'LOAN_SAVE_FAILURE')
    .do((action) => {
      let errors: ApiError[];
      if (_.isArray(action.payload)) {
        errors = action.payload.map((e: any) => {
          return {errorCode: e.errorCode || null, errorDescription: e.errorDescription || 'Unknown Error', propertyName: e.propertyName || null};
        });
      } else if (_.isObject(action.payload)) {
        errors = [{errorCode: action.payload.errorCode || null, errorDescription: action.payload.errorDescription || 'Unknown Error', propertyName: action.payload.propertyName || null}];
      } else if (_.isString(action.payload)) {
        errors = [{errorCode: null, errorDescription: action.payload || 'Unknown Error', propertyName: null}];
      } else {
        errors = [{errorCode: null, errorDescription: 'Unknown Error', propertyName: null}];
      }
      let errorMessage = errors.map((e) => e.errorDescription).join('/n');
      this.userNotificationService.notifyUserOfError(new Error(errorMessage), errorMessage);
    })
    .map(() => {
      return {
        action: null
      };
    });

}
