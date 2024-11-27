import {Options, parse, Parser as CsvLibParser} from 'csv-parse'
import {parse as parseSync} from 'csv-parse/sync';
import stream from "node:stream";

import {OreillyHighlight} from "../OreillyHighlight";
import {Temporal} from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

const parseOptions: Options = {
  columns: (headerRow) => {
    if (!Array.isArray(headerRow)) {
      throw new Error('Invalid CSV format');
    }

    const headerMapping: [string, keyof OreillyHighlight][] = [
      ['Book Title', 'bookTitle'],
      ['Chapter Title', "chapterTitle"],
      ['Date of Highlight', "dateOfHighlight"],
      ['Book URL', "bookURL"],
      ['Chapter URL', "chapterURL"],
      ['Annotation URL', "annotationURL"],
      ['Highlight', "highlight"],
      ['Color', "color"],
      ['Personal Note', "personalNote"]
    ];

    // Check if the record has the expected headers in the correct order
    if (!headerMapping.every(([expectedHeader], index) => headerRow[index] === expectedHeader)) {
      throw new Error('Invalid CSV format. Expected headers: ' + headerMapping.map(([header]) => header).join(', '));
    }

    // Return the mapped column headers
    return headerMapping.map(([, header]) => header);
  },
  onRecord: (record) => {
    return {
      ...record,
      dateOfHighlight: PlainDate.from(record.dateOfHighlight)
    };
  }
}

/**
 * Parser to retrieve the highlights from a CSV file as an array.
 */
export class CsvSyncParser {
  /**
   * Parses the input CSV file and returns the highlights as an array.
   */
  parse(input: string | Buffer): OreillyHighlight[] {
    return parseSync(input, parseOptions);
  }
}

/**
 * Parser to retrieve the highlights from a CSV file using a callback.
 */
export class CsvCallbackParser {
  /**
   * Parses the input CSV file and returns the highlights as an array using a callback.
   */
  parse(input: string | Buffer, callback: (err: Error | null, records: OreillyHighlight[]) => void): void {
    parse(input, parseOptions, (err, records) => {
      if (err) {
        callback(err, []);
      } else {
        callback(null, records);
      }
    })
  }
}

/**
 * A stream transformer to parse CSV data into OreillyHighlight objects.
 */
export class CsvStreamParser extends stream.Transform {
  private parser: CsvLibParser;

  constructor() {
    super({objectMode: true});
    this.parser = parse(parseOptions);

    this.parser.on('readable', () => {
      let record;
      while ((record = this.parser.read()) !== null) {
        this.push(record);
      }
    });
    this.parser.on('error', (err) => this.emit('error', err));
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: stream.TransformCallback): void {
    this.parser.write(chunk, encoding, callback);
  }

  _flush(callback: stream.TransformCallback): void {
    this.parser.end(callback);
  }
}
