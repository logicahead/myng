import {Component, ViewEncapsulation, ViewContainerRef, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {APP_PROVIDERS} from './app.providers';
import {AuthService, SessionState} from './shared';
import {ModalComponent} from './ui/shared/ld-modal/ld-modal.component';
import {LoanService} from './ui/loan/loan.service';
import {SaveLoanService} from './ui/shared/save-loan/save-loan.service';
import {UserActivityService} from './shared/user-activity.service';
import {WindowRefService} from './shared/window-ref.service';
import {LoanComponent} from './ui/loan/loan.component';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="app-content">
      <router-outlet></router-outlet>
    </div>
    <save-loan-modal></save-loan-modal>
    <loan-rate-lock-modal #loanRateLockModal
      *ngIf="sessionState.authenticated"
    ></loan-rate-lock-modal>

    <ld-modal class="session-expiration-modal"
      #sessionExpirationModal
      [config]="{ignoreBackdropClick: true, backdrop: 'static'}"
      [disableCloseButton]="false"
      [isErrorDialogModal]="true"
    >
      <h4 head>Automatic Logout</h4>
      <div body>
        <p>Due to inactivity, and to ensure the security of loan data, you will be logged out shortly. If you would like more time, select “Continue”. If you would like to save the loan and be logged out immediately, click “Save and Log Out”.</p>
        <p>You will be logged out in {{(auth.secondsUntilAuthExpires$ | async) || '-'}} seconds and will be redirected to the login page.</p>
      </div>
      <button footer class="btn btn-secondary btn-modal-cta m-r-2" (click)="onSessionExpirationNo()">Save and Logout</button>
      <button footer class="btn btn-primary btn-modal-cta" (click)="onSessionExpirationYes()">Continue</button>
    </ld-modal>

    <ld-modal
      #logoutConfirmationModal
      [config]="{ignoreBackdropClick: true, backdrop: 'static'}"
      [disableCloseButton]="true"
      [submitBtnText]="'Yes'"
      (submit)="onLogoutConfirmationYes()"
      [cancelBtnText]="'No'"
      (cancel)="onLogoutConfirmationNo()"
    >
      <div body>Are you sure that you want to logout?</div>
    </ld-modal>

    <pricing-exception-modal
      *ngIf="sessionState.authenticated"
    ></pricing-exception-modal>
    `,
  providers: [...APP_PROVIDERS]
})
export class App implements OnInit, AfterViewInit {

  @ViewChild('logoutConfirmationModal') private logoutConfirmationModal: ModalComponent;
  @ViewChild('sessionExpirationModal') private sessionExpirationModal: ModalComponent;
  @ViewChild('loanRateLockModal') private loanRateLockModal: ModalComponent;

  private beforeUnloadTimeout: number;

  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public auth: AuthService,
              public windowRef: WindowRefService,
              public userActivityService: UserActivityService,
              public sessionState: SessionState,
              public viewContainerRef: ViewContainerRef,
              public loanService: LoanService,
              public saveLoanService: SaveLoanService) {
  }

  ngOnInit() {
    // used for HMR, currently unused
    // console.log('Initial App State', this.appState.state);

    this.auth.initialize();

    this.auth.sessionExpiring$.subscribe(() => {
      this.saveLoanService.hideConfirmDialog();
      this.logoutConfirmationModal.hide();

      if (this.userActivityService.userHasRecentActivity()) {
        this.auth.refresh();
      } else {
        this.sessionExpirationModal.show();
      }
    });

    this.auth.sessionExpired$.subscribe(() => {
      this._closeOpenModals();
      this.auth.logout();
    });

    this.auth.login$.subscribe(() => {
      this.router.navigate(['/']);
    });

    this.auth.logout$.subscribe(() => {
      this._closeOpenModals();
      this.router.navigate(['/login']);
    });

    this.auth.userRequestedLogout$.subscribe(() => {
      if (!this.sessionState.authenticated) return; // cannot request logout while unauthenticated

      if (this.loanService.loan && this.loanService.isLoanDirty(this.loanService.loan)) {
        this.saveLoanService.showConfirmDialog().subscribe(canContinue => {
          if (!canContinue) return;
          this.logoutConfirmationModal.show();
        });

        return;
      }

      this.logoutConfirmationModal.show();
    });

    this.windowRef.nativeWindow.addEventListener('beforeunload', (e): string | boolean => {

      let token = this.sessionState.data.token;
      this.auth.persistCurrentSessionStateIntoStorage();

      if (
        this.loanService.loan &&
        this.loanService.isLoanDirty(this.loanService.loan) &&
        this.loanService.accessLock &&
        !this.loanService.accessLock.readOnly &&
        this.sessionState &&
        this.sessionState.data &&
        this.sessionState.data.token &&
        LoanComponent.isComponentActive(this.activatedRoute)
      ) {
        this.beforeUnloadTimeout = (setTimeout(() => {
          // this will only fire if user chooses to remain on the page. if this is the case, we want to remove their session from storage to prevent it from being loaded by another tab/window
          try {
            this.auth.removeSessionFromStorage(token);
          } catch(e) {
            // if the session was unable to be removed, it's because the user has opened a new tab while we are blocked waiting for a response to the alert (edge case)
            this.auth.logout();
          }
        }, 150)) as any;

        let productName = `Command Center`;
        let dialogText = `If you leave ${productName} now, you will lose any unsaved changes!!!`;
        e.returnValue = dialogText;
        return dialogText;
      } else {
        return true;
      }
    });

    this.windowRef.nativeWindow.addEventListener('unload', (e) => {
      if (this.beforeUnloadTimeout) clearTimeout(this.beforeUnloadTimeout);
    });
  }

  ngAfterViewInit(): void {
    var throttled = _.throttle(() => this.userActivityService.setLastUserActivity(), 5000);
    document.addEventListener('mousemove', () => throttled(), false);
    document.addEventListener('click', () => throttled(), false);
    document.addEventListener('scroll', () => throttled(), false);
  }

  onSessionExpirationYes() {
    this.sessionExpirationModal.hide();
    this.auth.refresh();
  }

  onSessionExpirationNo() {
    this.sessionExpirationModal.hide();

    if (this.loanService.loan && this.loanService.isLoanDirty(this.loanService.loan)) {
      this.saveLoanService.showConfirmDialog().subscribe(canContinue => {
        // if (!canContinue) return; // they've already said no to refreshing, "cancelling" the save loan modal is equivalent to clicking "no"
        this.auth.logout();
      });

      return;
    }

    this.auth.logout();
  }

  onLogoutConfirmationYes() {
    this.logoutConfirmationModal.hide();
    this.auth.logout();
  }

  onLogoutConfirmationNo() {
    this.logoutConfirmationModal.hide();
  }

  private _closeOpenModals() {
    this.saveLoanService.hideConfirmDialog();
    this.loanRateLockModal.hide();
    this.sessionExpirationModal.hide();
    this.logoutConfirmationModal.hide();
  }

}
