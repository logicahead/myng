import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Http, Headers, Request, Response, RequestOptionsArgs} from '@angular/http';
import {SessionState} from './session-state.service';
import {SETTINGS} from "../app.settings";

@Injectable()
export class HttpClient {

  public urlPrefix: string;



  constructor(private http: Http, private sessionState: SessionState) {
    this.urlPrefix = `${SETTINGS.API.URL}/${SETTINGS.API.NAME_SPACE}`;
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.request(`${this.urlPrefix}/${url}`, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.get(`${this.urlPrefix}/${url}`, options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.post(`${this.urlPrefix}/${url}`, body, options);
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.put(`${this.urlPrefix}/${url}`, body, options);
  }

  delete(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    if (body) options.body = body;
    return this.http.delete(`${this.urlPrefix}/${url}`, options);
  }

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.patch(`${this.urlPrefix}/${url}`, body, options);
  }

  head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.setAuthHeaders(options);
    return this.http.head(`${this.urlPrefix}/${url}`, options);
  }


  private setAuthHeaders(options: RequestOptionsArgs) {
    if (!options) options = {};
    if (!options.headers) options.headers = new Headers();

    let token = (this.sessionState.authenticated && this.sessionState.data && this.sessionState.data.token) ? this.sessionState.data.token : null;
    if (token) options.headers.set('Authorization', `Bearer ${token}`);

    return options;
  }
}
