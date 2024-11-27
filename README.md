# oreilly-highlight-parser

A library to parse the highlights export file from the O'Reilly Learning Platform.

## Installation

```bash
npm install oreilly-highlight-parser
```

## Usage

### Parsers

Each parser reads the highlights from the CSV file and expects the CSV to have the following columns:
- `Book Title`
- `Chapter Title`
- `Date of Highlight`
- `Book URL`
- `Chapter URL`
- `Annotation URL`
- `Highlight`
- `Color`
- `Personal Note`

#### `CsvSyncParser`
Reads all the highlights in the file into an array.

```typescript
import { CsvSyncParser } from 'oreilly-highlight-parser';

const csvContents = fs.readFileSync('path/to/highlights.csv', 'utf8');
const parser = new CsvSyncParser();

/**
 * [
 *   {
 *     bookTitle: 'Title of the book',
 *     chapterTitle: 'Title of the chapter',
 *     dateOfHighlight: 2024-11-27, // PlainDate
 *     bookUrl: 'https://example.com/book',
 *     chapterUrl: 'https://example.com/book/chapter',
 *     annotationUrl: 'https://example.com/book/chapter/annotation',
 *     highlight: 'Highlighted text',
 *     color: 'YELLOW',
 *     personalNote: 'Personal note',
 *   },
 *   ...
 * ]
 */
const highlights = parser.parseSync(csvContents);
```

#### `CsvCallbackParser`

Reads all the highlights in the file and calls a callback with the array of highlights.

```typescript
import { CsvCallbackParser } from 'oreilly-highlight-parser';

const csvContents = fs.readFileSync('path/to/highlights.csv', 'utf8');
const parser = new CsvCallbackParser();

parser.parse(csvContents, (error, highlights) => {
  // do something with highlights
  /**
   * [
   *   {
   *     bookTitle: 'Title of the book',
   *     chapterTitle: 'Title of the chapter',
   *     dateOfHighlight: 2024-11-27, // PlainDate
   *     bookUrl: 'https://example.com/book',
   *     chapterUrl: 'https://example.com/book/chapter',
   *     annotationUrl: 'https://example.com/book/chapter/annotation',
   *     highlight: 'Highlighted text',
   *     color: 'YELLOW',
   *     personalNote: 'Personal note',
   *   },
   *   ...
   * ]
   */
});
```

#### `CsvStreamParser`

Stream highlights from the file.

```typescript
import { CsvStreamParser } from 'oreilly-highlight-parser';

const csvStream = fs.createReadStream('path/to/highlights.csv');
const parser = new CsvStreamParser();

csvStream.pipe(parser)
  .on('data', (highlight) => {
    // do something with highlight
    /**
     * {
     *   bookTitle: 'Title of the book',
     *   chapterTitle: 'Title of the chapter',
     *   dateOfHighlight: 2024-11-27, // PlainDate
     *   bookUrl: 'https://example.com/book',
     *   chapterUrl: 'https://example.com/book/chapter',
     *   annotationUrl: 'https://example.com/book/chapter/annotation',
     *   highlight: 'Highlighted text',
     *   color: 'YELLOW',
     *   personalNote: 'Personal note',
     * }
     */
  });
```

### Formatters

#### `JsonFormatter`

Formats the highlight into a JSON string.

```typescript
import { JsonFormatter } from 'oreilly-highlight-parser';

const highlight = {
    bookTitle: 'Title of the book',
    chapterTitle: 'Title of the chapter',
    dateOfHighlight: 2024-11-27, // PlainDate
    bookUrl: 'https://example.com/book',
    chapterUrl: 'https://example.com/book/chapter',
    annotationUrl: 'https://example.com/book/chapter/annotation',
    highlight: 'Highlighted text',
    color: 'YELLOW',
    personalNote: 'Personal note',
}
const formatter = new JsonFormatter();
// "{\"bookTitle\":\"Title of the book\",\"chapterTitle\":\"Title of the chapter\",\"dateOfHighlight\":\"2024-11-27\",\"bookUrl\":\"https://example.com/book\",\"chapterUrl\":\"https://example.com/book/chapter\",\"annotationUrl\":\"https://example.com/book/chapter/annotation\",\"highlight\":\"Highlighted text\",\"color\":\"YELLOW\",\"personalNote\":\"Personal note\"}"
const json = formatter.format(highlight);
```

#### `MarkdownFormatter`

Formats the highlight into a Markdown quote block with a link to the annotation.

```typescript
import { MarkdownFormatter } from 'oreilly-highlight-parser';

const highlight = {
    bookTitle: 'Title of the book',
    chapterTitle: 'Title of the chapter',
    dateOfHighlight: 2024-11-27, // PlainDate
    bookUrl: 'https://example.com/book',
    chapterUrl: 'https://example.com/book/chapter',
    annotationUrl: 'https://example.com/book/chapter/annotation',
    highlight: 'Highlighted text',
    color: 'YELLOW',
    personalNote: 'Personal note',
}
const formatter = new MarkdownFormatter();

/**
 * > Highlighted Text
 * >
 * > \\- Title of the chapter, [Title of the book](https://example.com/book/chapter/annotation)
 */
const markdown = formatter.format(highlight);
```
