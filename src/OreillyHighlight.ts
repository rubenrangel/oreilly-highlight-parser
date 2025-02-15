import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

/**
 * A highlight from the O'Reilly Learning Platform.
 */
export interface OreillyHighlight {
  /**
   * The title of the book.
   */
  bookTitle: string;

  /**
   * The title of the chapter.
   */
  chapterTitle: string;

  /**
   * The date the highlight was created.
   */
  dateOfHighlight: PlainDate;

  /**
   * The URL of the book.
   */
  bookURL: string;

  /**
   * The URL of the chapter.
   */
  chapterURL: string;

  /**
   * The URL of the annotation.
   */
  annotationURL: string;

  /**
   * The highlighted text.
   */
  highlight: string;

  /**
   * The color of the highlight.
   */
  color: string;

  /**
   * A personal note associated with the highlight.
   */
  personalNote: string;
}
