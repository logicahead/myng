import * as _ from 'lodash';
import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/map';
import {Action} from '@ngrx/store';
import {LoanState} from './index';
import {ApiError} from '../api/v1';


export function loanReducer(state = null, action: Action): LoanState {
  switch (action.type) {

    case 'LOAD_LOAN': {
      return {
        working: null,
        server: null,
        loading: true,
        saving: false,
        saved: false,
        saveFailure: false,
        errors: []
      };
    }

    case 'LOAN_LOADED': {
      return {
        working: _.cloneDeep(action.payload),
        server: _.cloneDeep(action.payload),
        loading: false,
        saving: false,
        saved: false,
        saveFailure: false,
        errors: []
      };
    }

    case 'LOAN_LOAD_FAILURE': {
      let errors: ApiError[];
      if (_.isArray(action.payload)) {
        errors = action.payload.map((e: any) => {
          return {errorCode: e.errorCode || null, errorDescription: e.errorDescription || 'Unknown Error', propertyName: e.propertyName || null};
        });
      } else if (_.isObject(action.payload)) {
        errors = [{errorCode: action.payload.errorCode || null, errorDescription: action.payload.errorDescription || 'Unknown Error', propertyName: action.payload.propertyName || null}];
      } else if (_.isString(action.payload)) {
        errors = [{errorCode: null, errorDescription: action.payload || 'Unknown Error', propertyName: null}];
      } else {
        errors = [{errorCode: null, errorDescription: 'Unknown Error', propertyName: null}];
      }

      return {
        working: null,
        server: null,
        loading: false,
        saving: false,
        saved: false,
        saveFailure: false,
        errors: errors
      };
    }

    case 'SAVE_NEW_LOAN':
    case 'SAVE_LOAN': {
      return Object.assign({}, state, {
        loading: true,
        saving: true,
        saved: false,
        saveFailure: false
      });
    }

    case 'LOAN_SAVE_FAILURE': {
      let errors: ApiError[];
      if (_.isArray(action.payload)) {
        errors = action.payload.map((e: any) => {
          return {errorCode: e.errorCode || null, errorDescription: e.errorDescription || 'Unknown Error', propertyName: e.propertyName || null};
        });
      } else if (_.isObject(action.payload)) {
        errors = [{errorCode: action.payload.errorCode || null, errorDescription: action.payload.errorDescription || 'Unknown Error', propertyName: action.payload.propertyName || null}];
      } else if (_.isString(action.payload)) {
        errors = [{errorCode: null, errorDescription: action.payload || 'Unknown Error', propertyName: null}];
      } else {
        errors = [{errorCode: null, errorDescription: 'Unknown Error', propertyName: null}];
      }

      return Object.assign({}, state, {
        loading: false,
        saving: false,
        saved: false,
        saveFailure: true,
        errors: errors
      });
    }

    case 'LOAN_SAVED': {
      return {
        working: _.cloneDeep(action.payload),
        server: _.cloneDeep(action.payload),
        loading: false,
        saving: false,
        saved: true,
        saveFailure: false,
        errors: []
      };
    }

    case 'UPDATE_LOAN': {
      let updated = Object.assign({}, state.working, action.payload);
      return Object.assign({}, state, {working: updated});
    }

    default: {
      return state;
    }
  }
}

