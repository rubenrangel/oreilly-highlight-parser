# O'Reilly Highlight Parser

A TypeScript library for parsing highlight exports from the **O'Reilly Learning Platform**.

## Installation

Install via NPM:

```bash
npm install oreilly-highlight-parser
```

## Usage

This library provides three parsers to extract highlights from an O'Reilly CSV file. The CSV **must** contain the following columns:

- **Book Title**
- **Chapter Title**
- **Date of Highlight**
- **Book URL**
- **Chapter URL**
- **Annotation URL**
- **Highlight**
- **Color**
- **Personal Note**

### Parsers

#### Synchronous Parsing (`CsvSyncParser`)

Reads the entire CSV file into an array.

```typescript
import fs from 'fs';
import { CsvSyncParser } from 'oreilly-highlight-parser';

const csvContents = fs.readFileSync('path/to/highlights.csv', 'utf8');
const parser = new CsvSyncParser();

const highlights = parser.parse(csvContents);

console.log(highlights);
```

**Example Output:**
```json
[
  {
    "bookTitle": "Title of the book",
    "chapterTitle": "Title of the chapter",
    "dateOfHighlight": "2024-11-27",
    "bookUrl": "https://example.com/book",
    "chapterUrl": "https://example.com/book/chapter",
    "annotationUrl": "https://example.com/book/chapter/annotation",
    "highlight": "Highlighted text",
    "color": "YELLOW",
    "personalNote": "Personal note"
  }
]
```

#### Callback-Based Parsing (`CsvCallbackParser`)

Reads highlights and calls a callback function with the parsed data.

```typescript
import fs from 'fs';
import { CsvCallbackParser } from 'oreilly-highlight-parser';

const csvContents = fs.readFileSync('path/to/highlights.csv', 'utf8');
const parser = new CsvCallbackParser();

parser.parse(csvContents, (error, highlights) => {
  if (error) {
    console.error('Error parsing CSV:', error);
    return;
  }

  console.log(highlights);
});
```

#### Streaming Parsing (`CsvStreamParser`)

Processes highlights as a stream.

```typescript
import fs from 'fs';
import { CsvStreamParser } from 'oreilly-highlight-parser';

const csvStream = fs.createReadStream('path/to/highlights.csv');
const parser = new CsvStreamParser();

csvStream.pipe(parser)
  .on('data', (highlight) => {
    console.log(highlight);
  })
  .on('error', (err) => {
    console.error('Error parsing CSV:', err);
  });
```

### Formatters

#### JSON Formatter (`JsonFormatter`)

Converts parsed highlights into JSON.

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
};

const formatter = new JsonFormatter();
const json = formatter.transform(highlight);

console.log(json);
```

**Example Output:**
```json
{
  "bookTitle": "Title of the book",
  "chapterTitle": "Title of the chapter",
  "dateOfHighlight": "2024-11-27",
  "bookUrl": "https://example.com/book",
  "chapterUrl": "https://example.com/book/chapter",
  "annotationUrl": "https://example.com/book/chapter/annotation",
  "highlight": "Highlighted text",
  "color": "YELLOW",
  "personalNote": "Personal note"
}
```

#### Markdown Formatter (`MarkdownFormatter`)

Formats highlights into a Markdown quote block.

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
};

const formatter = new MarkdownFormatter();
const markdown = formatter.transform(highlight);

console.log(markdown);
```

**Example Output:**

```markdown
> Highlighted text
>
> - Chapter 1: Logic, [Essential Programming](https://example.com/book/chapter1#section)
```
**Escaped Chapter Titles Starting with Numbers:**

```markdown
> Highlighted text
>
> - 1\. Logic, [Essential Programming](https://example.com/book/chapter1#section)
```

## License

This library is licensed under the **MIT License**.
