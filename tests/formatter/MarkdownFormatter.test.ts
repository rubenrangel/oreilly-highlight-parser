import { describe, expect, test } from "vitest";
import { MarkdownFormatter } from "../../src/formatter/MarkdownFormatter";
import { OreillyHighlight } from "../../src/OreillyHighlight";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

describe("MarkdownFormatter", function () {
  describe("transform", function () {
    test("it should return a formatted string", function () {
      const highlight: OreillyHighlight = {
        bookTitle: "Essential Programming",
        chapterTitle: "Chapter 1: Logic",
        dateOfHighlight: new PlainDate(2021, 9, 29),
        bookURL: "https://exmaple.com/book",
        chapterURL: "https://exmaple.com/book/chapter1",
        annotationURL: "https://exmaple.com/book/chapter1#section",
        highlight: "Using logic.",
        color: "YELLOW",
        personalNote: "This is a personal note.",
      };
      const formatter = new MarkdownFormatter();

      const output = formatter.transform(highlight);

      expect(output).toMatchSnapshot();
    });

    test("the chapter title should be escaped if it starts with a number and a period", function () {
      const highlight: OreillyHighlight = {
        bookTitle: "Essential Programming",
        chapterTitle: "1. Logic",
        dateOfHighlight: new PlainDate(2021, 9, 29),
        bookURL: "https://exmaple.com/book",
        chapterURL: "https://exmaple.com/book/chapter1",
        annotationURL: "https://exmaple.com/book/chapter1#section",
        highlight: "Using logic.",
        color: "YELLOW",
        personalNote: "This is a personal note.",
      };
      const formatter = new MarkdownFormatter();

      const output = formatter.transform(highlight);

      expect(output).toMatchSnapshot();
    });
  });
});
