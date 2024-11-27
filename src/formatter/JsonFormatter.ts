import { OreillyHighlight } from "../OreillyHighlight";
import { Formatter } from "./Formatter";

/**
 * Formatter to transform a highlight into a JSON string.
 */
export class JsonFormatter implements Formatter {
  transform(record: OreillyHighlight): string {
    return JSON.stringify({
      ...record,
      dateOfHighlight: record.dateOfHighlight.toString(),
    });
  }
}
