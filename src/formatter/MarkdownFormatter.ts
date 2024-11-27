import { Formatter } from "./Formatter";
import { OreillyHighlight } from "../OreillyHighlight";

/**
 * Formatter to transform a highlight into a Markdown string.
 *
 * It formats the highlight as a blockquote with the highlight text, followed by the chapter title and book title.
 */
export class MarkdownFormatter implements Formatter {
  transform(record: OreillyHighlight): string {
    const { bookTitle, annotationURL, highlight } = record;
    let { chapterTitle } = record;

    // if the chapter title starts with a number and a period, escape the period
    // so it does not act like an ordered list item in Markdown.
    if (/^\d+\./.test(chapterTitle)) {
      chapterTitle = chapterTitle.replace(".", "\\.");
    }

    return `> ${highlight}\n>\n> \\- ${chapterTitle}, [${bookTitle}](${annotationURL})`;
  }
}
