import {HttpClient} from './http.service';
import {Logger, LogLevel} from './logger.service';
import {Observable} from "rxjs";
import {Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {ApiError} from "../models/common/web-api/response/api-error.model";
import {ApiResponse} from "../models/common/web-api/response/api-response.model";

export interface LoanStorage {
  version?: number;
  json: string;
}

export interface EditedPricingResultsMap {
  [key: string]: boolean
}

@Injectable()
export class StorageService {

  constructor(
    private logger: Logger,
    private http: HttpClient
  ) {}

  getFromOnlineStorage(loanId: string, type: string): Observable<LoanStorage | ApiError[]> {
    if (!loanId || !type) return Observable.of(null);

    return this.http.get(`storage/${loanId}/${type}`)
      .map((response: Response) => {
        this.logger.log(`Successfully fetched onlineStorage data (${type}) for loan ${loanId}.`, response.json());
        return (<ApiResponse<any>>response.json()).data;
      })
      .catch((response: Response) => {
        this.logger.log(`Error fetching onlineStorage data (${type}) for loan ${loanId}.`, response.json());
        return Observable.throw((<ApiResponse<any>>response.json()).errors);
      });
  };

  saveToOnlineStorage( loanId: string, type: string, contents: string, version?: number ): Observable<any | ApiError[]> {
    if (!loanId || !type || !contents) return Observable.of({});
    let requestData: LoanStorage = {
      json: contents
    };
    if (version) requestData.version = version;

    return this.http.put(`storage/${loanId}/${type}`, requestData)
      .map((response: Response) => {
        this.logger.log(`Successfully updated onlineStorage data (${type}) for loan ${loanId}.`, response.json(), LogLevel.INFO);
        return (<ApiResponse<any>>response.json()).data;
      })
      .catch((response: Response) => {
        this.logger.log(`Error updating onlineStorage data (${type}) for loan ${loanId}.`, response.json(), LogLevel.ERROR);
        return Observable.throw((<ApiResponse<any>>response.json()).errors);
      });
  };

}
