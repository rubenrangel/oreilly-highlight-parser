import { describe, expect, test } from "vitest";
import { CsvCallbackParser, OreillyHighlight } from "../../src";
import { CsvCallback } from "../../src/parsers/CsvCallbackParser";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

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
