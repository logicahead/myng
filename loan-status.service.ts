import {Injectable} from '@angular/core';
import {BorrowerInformation} from './borrower-information.model';
import {LoanState, AppState} from '../../../reducers/index';
import {LoanStatus} from './loan-status.model';
import {LoanService} from '../../loan/loan.service';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';


@Injectable()
export class LoanStatusService {

  public loanStatus: LoanStatus;
  public loanStatus$: Observable<LoanStatus>;
  public loanInteractingWithServer: boolean;

  private loanState$: Observable<LoanState>;

  constructor(private loanService: LoanService,
              private store: Store<AppState>) {

    let state$ = store.select('loan');

    this.loanState$ = state$
      .map((loanState: LoanState) => {
        return loanState;
      }).publishReplay().refCount();

    this.loanStatus$ = this.loanState$
      .map((loanState: LoanState) => this.getLoanStatusFromLoanState(loanState))
      .distinctUntilChanged((a, b) => _.isEqual(a, b));

    this.loanStatus$.subscribe((loanStatus: LoanStatus) => {
      this.loanStatus = loanStatus;
      this.loanInteractingWithServer = this.loanStatus.loading || this.loanStatus.saving || this.loanStatus.checkingAccessLockStatus;
    });
  }

  // When we should show the status component
  showStatus(): boolean {
    return ((this.loanStatus && this.loanStatus.errors && this.loanStatus.errors.length > 0) || this.loanInteractingWithServer);
  }

  private getLoanStatusFromLoanState(loanState: LoanState): LoanStatus {
    if (!loanState) loanState = {} as LoanState;

    return {
      checkingAccessLockStatus: this.loanService.accessLock.loading,
      loading: loanState.loading,
      saving: loanState.saving,
      saved: loanState.saved,
      saveFailure: loanState.saveFailure,
      errors: loanState.errors,
    };
  }
}
