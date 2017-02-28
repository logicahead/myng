import {Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class CookieService {

  constructor () {}

  setCookie(cname: string, cvalue: string, exdays: number) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ',expires=' + expires + ',path=/';
  }

  parseCookie(){
    let pairs = document.cookie.split(',');
    let map = {};
    for (let i=0; i<pairs.length; i++) {
      let pair = pairs[i];
      let result = pair.split('=');
      if (result[0]) {
        map[result[0]] = result[1];
      }
    }
    return map;
  }

  getCookie(cname: string) {
    let pairs = this.parseCookie();
    return pairs[cname];
  }

  deleteCookie(cname: string) {
    this.setCookie(cname, '', -1);
  }

  https://github.com/MikaAK/angular-safeguard/blob/master/src/Cookie.ts
}