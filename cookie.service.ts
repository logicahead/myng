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

 function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

 return document.cookie
      .split(COOKIE_SEP)
      .filter(value => !!value)
      .map(items => items.split('='))
      .reduce((res, [key, value]) => (res[decode(key)] = decode(value), res), {})
  }

  public static get(key): any {
    return this.getAll()[key]
}

getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                if(c.substring(name.length,c.length) == "") return false;
                return c.substring(name.length,c.length);
            }
        }
        return "";
}

  function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

  https://github.com/MikaAK/angular-safeguard/blob/master/src/Cookie.ts
}