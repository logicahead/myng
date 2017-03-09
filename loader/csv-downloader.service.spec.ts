import {CsvDownloader, CsvTable} from './csv-downloader.service';

describe('CsvDownloader', () => {
  let csvDownloader: CsvDownloader;
  let csvPrefix = 'data:text/csv;charset=utf-8,';

  beforeEach(() => csvDownloader = new CsvDownloader());

  describe('getCsvDataFromCsvTable', () => {
    it('generates proper csv from simple row', () => {
      let csvTable: CsvTable = {
        headerRow: null,
        rows: [['foo', 'bar', 'baz']]
      }
      let csvContent = csvDownloader.getCsvDataFromCsvTable(csvTable);
      expect(csvContent).toEqual(`${csvPrefix}"foo","bar","baz"\n`);
    });

    it('generates proper csv with headers from simple row', () => {
      let csvTable: CsvTable = {
        headerRow: ['Foo', 'Bar', 'Baz'],
        rows: [['foo', 'bar', 'baz']]
      }
      let csvContent = csvDownloader.getCsvDataFromCsvTable(csvTable);
      expect(csvContent).toEqual(`${csvPrefix}"Foo","Bar","Baz"\n"foo","bar","baz"\n`);
    });

    it('generates proper csv with complex data', () => {
      let csvTable: CsvTable = {
        headerRow: ['Foo', 'Bar', 'Baz'],
        rows: [[',",",","', '"""""', ',,,,,,,,'], ['!@#$%', 'fffffffffff', 'memes!']]
      }
      let csvContent = csvDownloader.getCsvDataFromCsvTable(csvTable);
      expect(csvContent).toEqual(`${csvPrefix}"Foo","Bar","Baz"\n","","","",""","""""""""""",",,,,,,,,"\n"!@#$%","fffffffffff","memes!"\n`);
    });
  });
});
