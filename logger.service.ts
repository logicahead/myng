import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {SETTINGS} from '../app.settings';

export enum LogLevel {
  ERROR = 1,
  WARN,
  INFO,
  DEBUG
}

@Injectable()
export class Logger {
  logs: {message: string, object?: any, logLevel: LogLevel}[] = [];

  log(message: string, object?: any, logLevel?: LogLevel) {
    if (!logLevel) logLevel = LogLevel.INFO;
    if (!object) object = null;

    this.logs.push({
      message: message,
      object: object,
      logLevel: logLevel
    });

    switch (logLevel) {
      case LogLevel.INFO:
        if (_.includes(SETTINGS.LOGGING.levels, LogLevel.INFO)) object ? console.log(message, object) : console.log(message);
        break;
      case LogLevel.DEBUG:
        if (_.includes(SETTINGS.LOGGING.levels, LogLevel.DEBUG)) object ? console.log(message, object) : console.log(message);
        break;
      case LogLevel.WARN:
        if (_.includes(SETTINGS.LOGGING.levels, LogLevel.WARN)) object ? console.warn(message, object) : console.warn(message);
        break;
      case LogLevel.ERROR:
        if (_.includes(SETTINGS.LOGGING.levels, LogLevel.ERROR)) object ? console.error(message, object) : console.error(message);
        break;
      default:
        if (_.includes(SETTINGS.LOGGING.levels, LogLevel.DEBUG)) object ? console.log(message, object) : console.log(message);
        break;
    }
  }
}
