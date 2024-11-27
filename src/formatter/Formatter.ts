import { OreillyHighlight } from "../OreillyHighlight";

/**
 * A formatter to transform highlights into a specific output.
 */
export interface Formatter {
  /**
   * Output the highlight into a formatted string.
   */
  transform(record: OreillyHighlight): string;
}
