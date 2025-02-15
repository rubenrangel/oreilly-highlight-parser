import { describe, expect, test } from "vitest";
import {
  CsvCallback,
  CsvCallbackParser,
  CsvStreamParser,
  CsvSyncParser,
} from "../../src/parser/CsvParser";
import { OreillyHighlight } from "../../src/OreillyHighlight";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

describe("CsvParser", () => {
  describe("parse", () => {
    test("it should parse the input into an array", () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."',
      ];
      const input = inputs.join("\n");
      const parser = new CsvSyncParser();

      const result = parser.parse(input);

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: new PlainDate(2021, 1, 1),
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note.",
        },
      ]);
    });
  });
});

describe("CsvCallbackParser", () => {
  describe("parse", () => {
    test("it should parse the input into an array", async () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."',
      ];
      const input = inputs.join("\n");
      const parser = new CsvCallbackParser();

      const result = await new Promise<OreillyHighlight[]>(
        (resolve, reject) => {
          parser.parse(input, (err, records) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          });
        },
      );

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: new PlainDate(2021, 1, 1),
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note.",
        },
      ]);
    });

    test("it should throw an error when the input is not a CSV", async () => {
      const input = "This is not a CSV";
      const parser = new CsvCallbackParser();

      const assertionCallback: CsvCallback = (error, records) => {
        expect(records).toEqual([]);
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toEqual(
          "Invalid CSV format. Expected headers: Book Title, Chapter Title, Date of Highlight, Book URL, Chapter URL, Annotation URL, Highlight, Color, Personal Note",
        );
      };

      await new Promise<void>((resolve) => {
        parser.parse(input, (err, records) => {
          assertionCallback(err, records);
          resolve();
        });
      });
    });
  });
});

describe("CsvStreamParser", () => {
  describe("parse", () => {
    test("it should parse the input into an array", async () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."',
      ];
      const input = inputs.join("\n");
      const parser = new CsvStreamParser();

      const result = await new Promise<OreillyHighlight[]>(
        (resolve, reject) => {
          const records: OreillyHighlight[] = [];
          parser.on("data", (record: OreillyHighlight) => records.push(record));
          parser.on("end", () => resolve(records));
          parser.on("error", reject);
          parser.write(input);
          parser.end();
        },
      );

      expect(result).toEqual<OreillyHighlight[]>([
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: new PlainDate(2021, 1, 1),
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note.",
        },
      ]);
    });

    test("it should throw an error when the first line is not a CSV header row", async () => {
      const input = "This is not a CSV";
      const parser = new CsvStreamParser();

      await new Promise<void>((resolve, reject) => {
        parser.on("data", () => {
          // fail the test if data is emitted
          reject("Data should not be emitted");
        });
        parser.on("error", (error) => {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toEqual(
            "Invalid CSV format. Expected headers: Book Title, Chapter Title, Date of Highlight, Book URL, Chapter URL, Annotation URL, Highlight, Color, Personal Note",
          );
          resolve();
        });
        parser.write(input);
        parser.end();
      });
    });

    test("it should emit valid data until an error occurs", async () => {
      const inputs = [
        '"Book Title","Chapter Title","Date of Highlight","Book URL","Chapter URL","Annotation URL","Highlight","Color","Personal Note"',
        '"The Art of Computer Programming, Vol. 1","1.1 Algorithms","2021-01-01","https://example.com/book","https://example.com/chapter","https://example.com/annotation","This is a highlight.","YELLOW","This is a note."',
        "foo",
      ];
      const input = inputs.join("\n");
      const parser = new CsvStreamParser();

      const expectedData = [
        {
          bookTitle: "The Art of Computer Programming, Vol. 1",
          chapterTitle: "1.1 Algorithms",
          dateOfHighlight: new PlainDate(2021, 1, 1),
          bookURL: "https://example.com/book",
          chapterURL: "https://example.com/chapter",
          annotationURL: "https://example.com/annotation",
          highlight: "This is a highlight.",
          color: "YELLOW",
          personalNote: "This is a note.",
        },
      ];
      const expectedError = new Error(
        "Invalid Record Length: columns length is 9, got 1 on line 3",
      );
      let actualData: OreillyHighlight[] = [];
      let actualError: Error | null = null;

      await new Promise<void>((resolve) => {
        parser.on("data", (record: OreillyHighlight) => {
          actualData = [record];
        });
        parser.on("error", (error: Error) => {
          actualError = error;
          resolve();
        });
        parser.write(input);
        parser.end();
      });

      expect(actualData).toEqual(expectedData);
      expect(actualError).toBeInstanceOf(Error);
      expect((actualError! as Error).message).toEqual(expectedError.message);
    });
  });
});
