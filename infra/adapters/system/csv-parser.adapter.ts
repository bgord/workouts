import type * as bg from "@bgord/bun";
import { parse } from "csv-parse";

class CsvParserAdapter implements bg.CsvParserPort {
  async process(content: string): Promise<ReadonlyArray<bg.CsvParsedRowType>> {
    return parse(content, { columns: true, trim: true, skip_empty_lines: true }).toArray();
  }
}

export const CsvParser = new CsvParserAdapter();
