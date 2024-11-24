import * as fs from "node:fs";
import {parseHighlights} from "./StreamOutputPraser";
import {MarkdownFormatter} from "./Formatters";


const csvStream = fs.createReadStream('../building-evolutionary-architectures-oreilly-annotations.csv');
const outputFile = fs.createWriteStream('../output.md', {flags: 'a'});

const formatter = new MarkdownFormatter();

(async () => {
  for await (const highlight of parseHighlights(csvStream)) {
    const formatted = formatter.transform(highlight);
    outputFile.write(`${formatted}\n\n`);
  }

  outputFile.end();
})();
