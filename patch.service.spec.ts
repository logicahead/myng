import {Patcher} from './patch.service';
import {Logger} from './logger.service';
import {GuidService} from './guid.service';

describe('Patcher', () => {
  let patcher: Patcher;

  let mockLogger = {} as Logger;
  let guidService = new GuidService();

  beforeEach(() => patcher = new Patcher(mockLogger, guidService));

  describe('patchMortgage', () => {
    let serverMortgage;
    let workingMortgage;
    const ENTITY_STATE_NEW = 'New';
    const accountNumber = '12345';
    const accountInName = 'myName';
    const mortgageGuid = '1_MTG_100108947';
    const borrowerGuid = '1_BOR_db6b3ba6-bd25-4b84-9d00-e0b6c8c51f89_100108947';

    describe('patching assets', () => {

      beforeEach(() => {
        serverMortgage = {
          'borrowers': [{
            'assets': [],
            'id': borrowerGuid
          }],
          'id': mortgageGuid
        };
        workingMortgage = {
          'borrowers': [{
            'assets': [{
              'id': null,
              'assetType': 'BankAccountAsset',
              'bankAccountAsset': {
                'bankAddress': {},
                'accountType': 'Savings',
                'accountNumber': accountNumber,
                'accountInName': accountInName,
                'balance': '500'
              },
              'equityAsset': null,
              'realEstateAsset': null,
              'lifeInsuranceAsset': null,
              'vestedRetFundAsset': null,
              'autoAsset': null,
              'businessAsset': null,
              'otherAsset': null
            }],
            'id': borrowerGuid
          }],
          'id': mortgageGuid
        };
      });

      let mortgageAssetAssertions = (patchedMortgage) => {
        let borrower = patchedMortgage.borrowers[0];
        expect(borrower).toBeTruthy('patched mortgage should contain one borrower');
        expect(borrower.assets).toBeTruthy('patched borrower should have assets array');
        expect(borrower.assets.length).toEqual(1, 'patched borrower should have 1 asset');
        let asset = borrower.assets[0];
        expect(asset.entityState).toEqual(ENTITY_STATE_NEW, `patched asset should have entityState ${ENTITY_STATE_NEW}`);
        expect(asset.bankAccountAsset.accountNumber).toEqual(accountNumber, `patched asset should have accountNumber ${accountNumber}`);
        expect(asset.bankAccountAsset.accountInName).toEqual(accountInName, `patched asset should have accountInName ${accountInName}`);
      };

      it('correctly patches asset as new, when asset has no id', () => {
        let patchedMortgage = patcher.patchMortgage(serverMortgage as any, workingMortgage as any);
        mortgageAssetAssertions(patchedMortgage);
      });

      it('correctly patches asset as new, when asset has client-side guid', () => {
        workingMortgage.borrowers[0].assets[0].id = guidService.createClientGuid();
        let patchedMortgage = patcher.patchMortgage(serverMortgage as any, workingMortgage as any);
        mortgageAssetAssertions(patchedMortgage);
      });

    });

  });

});
