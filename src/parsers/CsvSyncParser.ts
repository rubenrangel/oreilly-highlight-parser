import { OreillyHighlight } from "../OreillyHighlight";
import { parseOptions } from "./CsvParser";
import { parse as parseSync } from "csv-parse/sync";

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
