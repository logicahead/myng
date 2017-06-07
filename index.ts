import {combineReducers} from '@ngrx/store';
import {loanReducer} from './loan';
import {Mortgage} from '../models/Mortgage';
import {ApiError} from '../api/v1';


export interface LoanState {
  working: Mortgage;
  server: Mortgage;
  loading: boolean;
  saving: boolean;
  saved: boolean;
  saveFailure: boolean;
  errors: ApiError[];
}

export interface AppState {
  loan: LoanState;
}

export default combineReducers({
  loan: loanReducer
});
