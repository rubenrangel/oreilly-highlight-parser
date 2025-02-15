import { Options } from "csv-parse";

import { OreillyHighlight } from "../OreillyHighlight";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

export const parseOptions: Options = {
  columns: (headerRow) => {
    if (!Array.isArray(headerRow)) {
      throw new Error("Invalid CSV format");
    }

    const headerMapping: [string, keyof OreillyHighlight][] = [
      ["Book Title", "bookTitle"],
      ["Chapter Title", "chapterTitle"],
      ["Date of Highlight", "dateOfHighlight"],
      ["Book URL", "bookURL"],
      ["Chapter URL", "chapterURL"],
      ["Annotation URL", "annotationURL"],
      ["Highlight", "highlight"],
      ["Color", "color"],
      ["Personal Note", "personalNote"],
    ];

    // Check if the record has the expected headers in the correct order
    if (
      !headerMapping.every(
        ([expectedHeader], index) => headerRow[index] === expectedHeader,
      )
    ) {
      throw new Error(
        "Invalid CSV format. Expected headers: " +
          headerMapping.map(([header]) => header).join(", "),
      );
    }

    // Return the mapped column headers
    return headerMapping.map(([, header]) => header);
  },
  onRecord: (record) => {
    return {
      ...record,
      dateOfHighlight: PlainDate.from(record.dateOfHighlight),
    };
  },
};
