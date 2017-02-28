class ClientStorageService {
  static driver:any = window.localStorage;

  static set(key:string,  value:any):boolean {
    let
      res:boolean = false,
      v:string
    ;

    if(!key || !ClientStorageService.driver) {
      return res;
    }

    try {
      v = JSON.stringify(value);
    } catch(e) {
      v = value;
    }

    try {
      ClientStorageService
        .driver
        .setItem(key, v)
      ;

      res = true;
    } catch(e) {}

    return res;
  }

  static get(key:string):any {
    let
      res:any = null,
      v:string
    ;

    if(!key || !ClientStorageService.driver) {
      return res;
    }

    v = ClientStorageService
      .driver
      .getItem(key)
    ;

    if(!v) {
      return res;
    }

    try {
      res = JSON.parse(v);
    } catch(e) {}

    return res;
  }

  static has(key:string):boolean {
    let res:boolean = false;

    if(ClientStorageService.driver) {
      res = ClientStorageService.driver.hasOwnProperty(key);
    }

    return res;
  }

  static clearItem(key:string):boolean {
    if(ClientStorageService.driver) {
      ClientStorageService.driver.removeItem(key);
      return true;
    }

    return false;
  }
}
