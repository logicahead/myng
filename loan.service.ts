import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Logger} from '../../shared/logger.service';

import {Observable} from 'rxjs/Observable';
import {AppState, LoanState} from '../../reducers/index';
import {Store} from '@ngrx/store';
import {Mortgage} from '../../models/Mortgage';
import {Patcher} from '../../shared/patch.service';
import {LoanViewModel, LoanViewModelBuilder} from './loan-view-model-builder.service';
import {MortgageFactory} from '../../shared/mortgage-factory.service';
import {ApiError} from '../../api/v1';
import {LoanDataService} from '../../data/loan.data.service';

export const NEW = 'new';

// TODO: Refactor logic for the creation of a new loan
// Instead of setting the route to /loan/new, modify routes to support /loan url

@Injectable()
export class LoanService {
  public activeLoanId: string;
  public loanViewModel: LoanViewModel;

  public loan$: Observable<Mortgage>; // working
  public loan: Mortgage; // working
  public safeLoan$: Observable<Mortgage>; // working, never null

  public loanIsDirty$: Observable<boolean>;
  public loanIsDirty: boolean;

  public loading$: Observable<boolean>;
  public loading: boolean;

  public saving: boolean;

  public saved$: Observable<boolean>;

  public errors: ApiError[] = [];

  public accessLock: {
    // status: AccessLockStatus
    loading: boolean;
    lockedByOtherSession: boolean;
    lockedByOtherUser: boolean;
    error: boolean;
    readOnly: boolean;
  } = {
    loading: true,
    lockedByOtherSession: false,
    lockedByOtherUser: false,
    error: false,
    readOnly: false
  };

  private serverLoan: Mortgage; // server
  private saveNewLoanFlag: boolean = false;

  constructor(private logger: Logger,
              private store: Store<AppState>,
              private patcher: Patcher,
              private router: Router,
              private loanViewModelBuilder: LoanViewModelBuilder,
              private mortgageFactory: MortgageFactory,
              private loanDataService: LoanDataService) {

    let state$ = store.select('loan');

    this.loading$ = state$
      .map((loanState: LoanState) => loanState ? loanState.loading : null)
      .distinctUntilChanged()
      .do((loading: boolean) => this.loading = loading);


    this.saved$ = state$
      .map((loanState: LoanState) => loanState ? {saved: loanState.saved, saveFailure: loanState.saveFailure} : {})
      .distinctUntilChanged((a, b) => _.isEqual(a, b))
      .filter((s: {saved: boolean; saveFailure: boolean; }) => !!s.saved || !!s.saveFailure)
      .map((s: {saved: boolean; saveFailure: boolean; }) => !!s.saved)
      .share();

    state$
      .map((loanState: LoanState) => loanState ? loanState.errors : [])
      .distinctUntilChanged()
      .do((errors: any[]) => this.errors = errors);

    this.loan$ = state$
      .do((loanState: LoanState) => {
        if (this.saveNewLoanFlag && this.activeLoanId === NEW && loanState.working.id != null) {
          this.saveNewLoanFlag = false;
          this.activeLoanId = loanState.working.id;
          this.router.navigate(['loan', loanState.working.id]);
        }
        this.loan = loanState ? loanState.working : null;
        this.serverLoan = loanState ? loanState.server : null;
      })
      .map((loanState: LoanState) => {
        return loanState ? _.cloneDeep(loanState.working) : null;
      });
    // This is a proof of concept observer to see if filtering out non-null loans is fine to do
    this.safeLoan$ = this.loan$.filter((loan: Mortgage) => !!loan);

    this.loanIsDirty$ = this.loan$
      .distinctUntilChanged((a, b) => _.isEqual(a, b))
      .map((loan: Mortgage) => {
        return loan ? this.isLoanDirty(loan) : null;
      });

    this.loanIsDirty$.subscribe((loanIsDirty: boolean) => {
      this.loanIsDirty = loanIsDirty;
    });

    state$
      .map((loanState: LoanState) => (loanState && loanState.working && _.cloneDeep(loanState.working)) || null)
      .distinctUntilChanged((a, b) => _.isEqual(a, b))
      .subscribe((mortgage: Mortgage) => {
        this.loanViewModel = mortgage ? this.loanViewModelBuilder.createLoanViewModelFromMortgage(mortgage) : null;
      });
  }

  setActiveLoan(id) {
    this.logger.log(`Active loan set to ${id}.`);
    this.activeLoanId = id;
  }

  openLoan(id: string) {
    this.setActiveLoan(id);
    this.store.dispatch({type: 'LOAD_LOAN', payload: {id: id}});
  }

  openNewLoan() {
    this.setActiveLoan(NEW);
    let mortgage = this.mortgageFactory.createBlankMortgage();
    this.store.dispatch({type: 'LOAD_NEW_LOAN', payload: mortgage});
  }

  isLoanDirty(mortgage: Mortgage): boolean {
    return !!this.patcher.patchMortgage(this.serverLoan, mortgage);
  }

  reloadLoan(): Observable<Mortgage> {
    this.openLoan(this.activeLoanId);

    return this.loan$.filter(() => !this.loading).take(1);
  }

  saveLoan(mortgage: Mortgage): boolean {
    if (this.accessLock.readOnly) return;
    if (this.activeLoanId === NEW) {
      this.saveNewLoan(mortgage);
      return true;
    }

    let patchedMortgage = this.patcher.patchMortgage(this.serverLoan, mortgage);

    if (!patchedMortgage) {
      this.logger.log('No changes to patch.');
      return false;
    }

    this.store.dispatch({type: 'SAVE_LOAN', payload: patchedMortgage});

    return true;
  }

  saveLoanSilently( mortgage?: Mortgage ) {
    return this.loanDataService.updateMortgage(this.activeLoanId, mortgage || this.loan);
  }

  saveNewLoan(mortgage: Mortgage) {
    this.saveNewLoanFlag = true;
    let patchedMortgage = this.patcher.patchMortgage(null, mortgage);
    this.store.dispatch({type: 'SAVE_NEW_LOAN', payload: patchedMortgage});
  }

  updateLoan(mortgage: Mortgage) {
    if (this.accessLock.readOnly) return;
    this.store.dispatch({ type: 'UPDATE_LOAN', payload: mortgage });
  }
}
