import {describe, expect, test} from "vitest";
import {CsvCallbackParser, CsvStreamParser, CsvSyncParser} from "../../src/parser/CsvParser";
import {OreillyHighlight} from "../../src/OreillyHighlight";

describe('CsvParser', () => {
  describe('parse', () => {
    test('it should parse the input into an array', () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."'
      ];
      const input = inputs.join("\n");
      const parser = new CsvSyncParser();

      const result = parser.parse(input);

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: "2021-01-01",
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note."
        }
      ]);
    })
  })
})

describe('CsvCallbackParser', () => {
  describe('parse', () => {
    test('it should parse the input into an array', async () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."'
      ];
      const input = inputs.join("\n");
      const parser = new CsvCallbackParser();

      const result = await new Promise<OreillyHighlight[]>((resolve, reject) => {
        parser.parse(input, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        });
      });

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: "2021-01-01",
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note."
        }
      ]);
    });
  });
});

describe('CsvStreamParser', () => {
  describe('parse', () => {
    test('it should parse the input into an array', async () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."'
      ];
      const input = inputs.join("\n");
      const parser = new CsvStreamParser();

      const result = await new Promise<OreillyHighlight[]>((resolve, reject) => {
        const records: OreillyHighlight[] = [];
        parser.on('data', (record: OreillyHighlight) => records.push(record));
        parser.on('end', () => resolve(records));
        parser.on('error', reject);
        parser.write(input);
        parser.end();
      });

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: "2021-01-01",
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note."
        }
      ]);
    });
  });
});
