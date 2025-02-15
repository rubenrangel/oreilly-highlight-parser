import stream from "node:stream";
import { parse, Parser as CsvLibParser } from "csv-parse";
import { parseOptions } from "./CsvParser";

/**
 * A stream transformer to parse CSV data into OreillyHighlight objects.
 */
export class CsvStreamParser extends stream.Transform {
  private parser: CsvLibParser;

  constructor() {
    super({ objectMode: true });
    this.parser = parse(parseOptions);

    this.parser.on("readable", () => {
      let record;
      while ((record = this.parser.read()) !== null) {
        this.push(record);
      }
    });
    this.parser.on("error", (err) => this.emit("error", err));
  }

  _transform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The type of `chunk` is any in the overriden function.
    chunk: any,
    encoding: BufferEncoding,
    callback: stream.TransformCallback,
  ): void {
    this.parser.write(chunk, encoding, callback);
  }

  _flush(callback: stream.TransformCallback): void {
    this.parser.end(callback);
  }
}
