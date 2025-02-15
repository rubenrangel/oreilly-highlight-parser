import { describe, expect, test } from "vitest";
import { OreillyHighlight } from "../../src/OreillyHighlight";
import { Temporal } from "@js-temporal/polyfill";
import { CsvSyncParser } from "../../src/parsers/CsvSyncParser";
import PlainDate = Temporal.PlainDate;

describe("CsvSyncParser", () => {
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
