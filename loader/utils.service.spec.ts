import {Utils} from './utils.service';

describe('UtilsService', () => {
  let utils: Utils;
  beforeEach(() => utils = new Utils());

  describe('parseHouseNumberFromStreet', () => {
    it('parses basic addresses', () => {
      let address = '12345 Lame Street';
      let houseNumber = utils.parseHouseNumberFromStreet(address);
      expect(houseNumber).toEqual('12345');
    });
    it('parses invalid addresses', () => {
      let address = '#12345, Lame Street 16000';
      let houseNumber = utils.parseHouseNumberFromStreet(address);
      expect(houseNumber).toEqual('12345');
    });
    it('returns null when no house number is found', () => {
      let address = 'One Star Drive';
      let houseNumber = utils.parseHouseNumberFromStreet(address);
      expect(houseNumber).toBeNull();
    });

  });

  describe('extractDateFromDateTime', () => {
    it('extracts date from JSON datetime', () => {
      let datetime = '2016-10-14T21:36:41.441Z';
      let time = utils.extractDateFromDateTime(datetime);
      expect(time).toEqual('2016-10-14');
    });
  });

  describe('getOnlyDigitsFromString', () => {
    it('gets digits from string', () => {
      expect(utils.getOnlyDigitsFromString('12345')).toEqual('12345');
      expect(utils.getOnlyDigitsFromString('abc12345')).toEqual('12345');
      expect(utils.getOnlyDigitsFromString('!@#$%^&*()12345')).toEqual('12345');
      expect(utils.getOnlyDigitsFromString('!@#$%^&*()12345ASDFqwerty')).toEqual('12345');
      expect(utils.getOnlyDigitsFromString(null)).toEqual(null);
      expect(utils.getOnlyDigitsFromString(undefined)).toEqual(undefined);
      expect(utils.getOnlyDigitsFromString(12345 as any)).toEqual(12345);
    });
  });
});
