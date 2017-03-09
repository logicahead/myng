import {Injectable} from '@angular/core';

export interface SessionData {
  userGuid: string;
  token: string;
  expires: string;
  expirationSeconds: number;
}

@Injectable()
export class SessionState {
  authenticated: boolean;
  authenticatedForMfa: boolean;
  duoSignRequest: string;
  username: string;
  data: SessionData;
}
