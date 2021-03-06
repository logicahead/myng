import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
  // We expect the server to sent us a date in UTC
  // The server expects the user's *local time* in UTC
  localTimeInUTCToDatePickerDate(localTimeInUTC: string): string {
    if (localTimeInUTC === null || typeof localTimeInUTC === 'undefined') {
      return localTimeInUTC;
    }

    let datePickerDate: string = '';

    // TODO: Revisit this because we're just chopping off the time which will probably break something at some point
    if (localTimeInUTC !== null && typeof localTimeInUTC === 'string' && localTimeInUTC.indexOf('T') > 0) {
      datePickerDate = localTimeInUTC.split('T')[0];
    }

    return datePickerDate;
  }

  // The server expects the user's *local time* in UTC
  datePickerDateToLocalTimeInUTC(datePickerDate: string): string {
    if (datePickerDate === null || typeof datePickerDate === 'undefined') {
      return datePickerDate;
    }

    if (datePickerDate !== null && typeof datePickerDate === 'string' && datePickerDate.indexOf('T') > 0) {
      datePickerDate = datePickerDate.split('T')[0];
    }

    let dateParts: string[] = datePickerDate.split('-');
    if (dateParts[0].length > 4) {
      datePickerDate = dateParts[0].substr(0, 4) + '-' + dateParts[1] + '-' + dateParts[2]; // don't let user enter absurd years
    }

    let dateString: string = momentTimezone.tz(datePickerDate, moment.tz.guess()).format(); // add the user's timezone to the date
    if (dateString === 'Invalid date') {
      dateString = '';
    }

    if (dateString !== '') {
      // convert it to the same format backend uses (otherwise the form is always dirty)
      dateString = new Date(dateString).toISOString();

      // chop off milliseconds since backend doesn't send it and it really should be .000Z
      dateString = dateString.split('.000Z').join('');
    }

    return dateString;
  }

  // Note: This function intentionally *only returns numbers* and not things like decimals.
  // Do not modify this to also return other values
  getOnlyDigitsFromString(value: any): any {
    if (_.isString(value)) {
      return value.replace(/[^\d]/g, '');
    } else {
      return value;
    }
  }

  formatSSN(ssn: string): string {
    if (!ssn) {
      return ssn;
    }

    ssn = this.getOnlyDigitsFromString(ssn);
    let formattedSSN: string = '';

    if (ssn && ssn.length) {
      for (let x = 0; x < ssn.length; x++) {
        if (x === 2 || x === 4) {
          formattedSSN += ssn[x] + '-';
        } else {
          formattedSSN += ssn[x];
        }
      }
    } else {
      formattedSSN = ssn;
    }

    return formattedSSN;
  }

  // Note: We need to format phone numbers the same way Empower does
  formatPhoneNumber(phoneNumber: string): string {
    let strippedNumber = this.getOnlyDigitsFromString(phoneNumber);
    let formattedPhoneNumber: string = '';

    // chop off extra numbers because QA
    if (strippedNumber && strippedNumber.length > 10) {
      strippedNumber = strippedNumber.substr(0, 10);
    }

    // don't accidentally reformat international or weird phone numbers
    if (strippedNumber) {
      for (let x = 0; x < strippedNumber.length; x++) {
        if (x === 0) {
          formattedPhoneNumber += '(' + strippedNumber[x];
        } else if (x === 2) {
          formattedPhoneNumber += strippedNumber[x] + ')';
        } else if (x === 5) {
          formattedPhoneNumber += strippedNumber[x] + '-';
        } else {
          formattedPhoneNumber += strippedNumber[x];
        }
      }
    } else {
      formattedPhoneNumber = phoneNumber; // reset to original number if things are weird
    }

    return formattedPhoneNumber;
  }

  // Note: We need to format phone numbers the same way Empower does
  formatPhoneNumberWithExt(phoneNumber: string): string {
    let strippedNumber = this.getOnlyDigitsFromString(phoneNumber);
    let formattedPhoneNumber: string = '';

    // chop off extra numbers because QA
    if (strippedNumber && strippedNumber.length > 20) {
      strippedNumber = strippedNumber.substr(0, 20);
    }

    // don't accidentally reformat international or weird phone numbers
    if (strippedNumber) {
      for (let x = 0; x < strippedNumber.length; x++) {
        if (x === 0) {
          formattedPhoneNumber += '(' + strippedNumber[x];
        } else if (x === 2) {
          formattedPhoneNumber += strippedNumber[x] + ')';
        } else if (x === 5) {
          formattedPhoneNumber += strippedNumber[x] + '-';
        } else if (x === 9) {
          formattedPhoneNumber += strippedNumber[x] + ' Ext. ';
        } else {
          formattedPhoneNumber += strippedNumber[x];
        }
      }
    } else {
      formattedPhoneNumber = phoneNumber; // reset to original number if things are weird
    }

    return formattedPhoneNumber;
  }

  formatZipCode(zip: string): string {
    let strippedNumber = this.getOnlyDigitsFromString(zip);
    let formattedZip: string = '';

    // chop off extra numbers because QA
    if (strippedNumber && strippedNumber.length > 9) {
      strippedNumber = strippedNumber.substr(0, 9);
    }

    if (strippedNumber) {
      for (let x = 0; x < strippedNumber.length; x++) {
        if (x === 4) {
          formattedZip += strippedNumber[x] + '-';
        } else {
          formattedZip += strippedNumber[x];
        }
      }
    } else {
      formattedZip = zip; // reset new number on overwrite
    }

    return formattedZip;
  }

  mapLoanCurrencyToInput(value: any, precision: number = 2): string {
    if (value === null || typeof value === 'undefined' || value === '') {
      return value;
    }

    try {
      if (typeof value === 'number') {
        if (isNaN(value)) {
          console.error(`(map LoanCurrency -> Input) Value was was NaN. Returning an empty string.`, value);
          return '';
        }

        let fixedNumber: string = value.toFixed(precision);

        if (fixedNumber === 'NaN') {
          console.error(`(map LoanCurrency -> Input) Error converting '${value}' to a fixed number (was NaN). Returning original value as string.`);
          return value.toString();
        } else {
          return fixedNumber;
        }
      } else {
        return value;
      }
    } catch (e) {
      console.error(`(map LoanCurrency -> Input) Error converting '${value}' to a fixed number. Returning an empty string.`);
      return '';
    }
  }

  mapCurrencyInputToLoan(value: any, precision: number = 2): number {
    if (value === null || typeof value === 'undefined' || value === '') {
      return value;
    }

    if (typeof value === 'string') {
      try {
        return Number(parseFloat(value).toFixed(precision));
      } catch (e) {
        console.error(`(map CurrencyInput -> Loan) Error converting '${value}' to a fixed number. Returning 0.`);
        return 0;
      }
    } else {
      return value;
    }
  }

  parseImplicitUtcString(date: string): Date { // adds UTC timezone information to date string
    if (!date) return null;
    try {
      let m = moment.utc(date);
      if (!m.isValid()) return null;
      return m.toDate();
    } catch (e) {
      return null;
    }
  }

  transformDateIntoUtcString(date: Date): string {
    if (!date) return null;
    try {
      let m = moment(date).utc();
      if (!m.isValid()) return null;
      return m.format();
    } catch (e) {
      return null;
    }
  }

  parseHouseNumberFromStreet(street: string): string {
    if (!_.isString(street)) return null;
    let matches = street.match(/[0-9]+/g);
    return matches ? (matches[0] || null) : null;
  }

  extractDateFromDateTime(date: string): string {
    let newDate: string = '';

    if (date === null || typeof date === 'undefined') {
      newDate = null;
    } else if (date !== '' && date.indexOf('T') > 0) {
      newDate = date.split('T')[0];
    } else {
      newDate = '';
    }

    return newDate;
  }

  convertToMomentTimezone(timezone: string): string {
    // todo: enum/constants for API time zones
    switch (timezone) {
      case 'Alaska Time Zone':
        return 'America/Anchorage';
      case 'Central Time Zone':
        return 'America/Matamoros';
      case 'Eastern Time Zone':
        return 'America/New_York';
      case 'Hawaii-Aleutian Time Zone':
        return 'Pacific/Honolulu';
      case 'Mountain Time Zone':
        return 'America/Boise';
      case 'Pacific Time Zone':
        return 'America/Los_Angeles';
      case 'PST':
        return 'America/Los_Angeles';
      default:
        return 'America/Los_Angeles';
    }
  }

  requiredFieldClass(value: any) {
    if (value === null || typeof value === 'undefined') {
      return true;
    } else if (typeof value === 'string' && value === '' || value === ' ') {
      return true;
    }
  }

  convertNumberValue(value: any) {
    // keep unedited values the same
    if (value === null || typeof value === 'undefined' || value === '') {
      return value;
    }

    let num: number = parseFloat(value);

    if (isNaN(num)) {
      return value; // return original value if the converted value isn't a number
    } else {
      return num;
    }
  }

  convertNumberValueToString(value: any): string {
    // keep unedited values the same
    if (value === null || typeof value === 'undefined') {
      return value;
    }

    return value.toString();
  }

  roundToNearestPenny(value: number): number {
    if (!value) return null;
    return Math.round(value * 100) / 100;
  }

  roundToOneDecimal(value: number): number {
    if (!value) return null;
    return parseFloat((Math.round((value) * 10) / 10).toFixed(1) as any);
  }

  getMonthsBetweenMoments(startMoment: moment.Moment, endMoment: moment.Moment) {
    if (!startMoment || !startMoment.isValid() || !endMoment || !endMoment.isValid()) return null;

    let getAbsoluteMonths = (momentDate) => {
      var months = parseInt(momentDate.format("MM") as any);
      var years = parseInt(momentDate.format("YYYY") as any);
      return months + (years * 12);
    }

    var startMonths = getAbsoluteMonths(startMoment);
    var endMonths = getAbsoluteMonths(endMoment);

    let months = endMonths - startMonths;
    return months;
  }

  // Note: state refers to a state in an address
  // ensure value is null if it's empty so default value shows in dropdown
  formatStateFromLoan(state: string): string {
    if (state === '' || typeof state === 'undefined') {
      return null;
    } else {
      return state;
    }
  }

  // ensure value is an empty string if it's empty so default value shows in dropdown
  formatCountryFromLoan(country: string): string {
    if (country === null || typeof country === 'undefined') {
      return ''; // country must be an empty string to default to United States
    } else {
      return country;
    }
  }

  formatStateToLoan(originalState: string, newState: string): string {
    // only update state if it changed
    // TODO: There is probably an opportunity here for a more concise if-statement
    if (originalState === null || typeof originalState === 'undefined') {
      if (newState !== null) {
        return newState;
      } else {
        return originalState;
      }
    } else {
      return newState;
    }
  }

  formatCountryToLoan(originalCountry: string, newCountry: string): string {
    // only update country if it changed
    // TODO: There is probably an opportunity here for a more concise if-statement
    if (originalCountry === null || typeof originalCountry === 'undefined') {
      if (newCountry !== '') {
        return newCountry;
      } else {
        return originalCountry;
      }
    } else {
      return newCountry;
    }
  }

  // Only use this when you need a value to do math on like add or divide
  convertValueForMath(value: any): number {
    if (value === null || typeof value === 'undefined') {
      return 0;
    } else {
      let valueAsNumber: number = Number(value);

      if (isNaN(valueAsNumber)) {
        return 0;
      } else {
        return valueAsNumber;
      }
    }
  }
}
