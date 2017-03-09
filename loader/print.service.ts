import * as $ from 'jquery';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {WindowRefService} from './window-ref.service';

@Injectable()
export class PrintService {
  static PRINT_CONTENT_CLASS = 'print-content';

  public printEnter$: Subject<any> = new Subject<any>();
  public printExit$: Subject<any> = new Subject<any>();

  private window: any;

    constructor( private windowRefService: WindowRefService ) {
      this.window = this.windowRefService.nativeWindow;

      if (window.matchMedia) {
          var mediaQueryList = window.matchMedia('print');
          mediaQueryList.addListener( mql => mql.matches ? this.printEnter$.next(null) : this.onPrintExit() );
      }
    }

  public print() {
    $(this.window.document.body).addClass('no-print');
    setTimeout(this.window.print);
  }

  private onPrintExit() {
    $(this.window.document.body).removeClass('no-print');
    this.printExit$.next(null);
  }

}
