import {describe, expect, test} from "vitest";
import {OreillyHighlight} from "../../src/OreillyHighlight";
import {JsonFormatter} from "../../src/formatter/JsonFormatter";

describe('JsonFormatter', function () {
  describe('transform', function () {
    test('it should return a JSON string', function () {
      const highlight: OreillyHighlight = {
        bookTitle: 'Essential Programming',
        chapterTitle: 'Chapter 1: Logic',
        dateOfHighlight: '2021-09-19',
        bookURL: 'https://exmaple.com/book',
        chapterURL: 'https://exmaple.com/book/chapter1',
        annotationURL: 'https://exmaple.com/book/chapter1#section',
        highlight: 'Using logic.',
        color: 'YELLOW',
        personalNote: 'This is a personal note.'
      }
      const formatter = new JsonFormatter();

      const output = formatter.transform(highlight);

      expect(output).toMatchSnapshot();
    });
  });
});