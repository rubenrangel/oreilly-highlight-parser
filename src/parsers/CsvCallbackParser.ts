import { OreillyHighlight } from "../OreillyHighlight";
import { parseOptions } from "./CsvParser";
import { parse as csvLibParse } from "csv-parse";

export type CsvCallback = (
  err: Error | null,
  records: OreillyHighlight[],
) => void;

/**
 * Parser to retrieve the highlights from a CSV file using a callback.
 */
export class CsvCallbackParser {
  /**
   * Parses the input CSV file and returns the highlights as an array using a callback.
   */
  parse(input: string | Buffer, callback: CsvCallback): void {
    csvLibParse(input, parseOptions, (err, records) => {
      if (err) {
        callback(err, []);
      } else {
        callback(null, records);
      }
    });
  }
}
