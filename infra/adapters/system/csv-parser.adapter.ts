import type * as bg from "@bgord/bun";
import * as csv from "csv";

class CsvParserAdapter implements bg.CsvParserPort {
  async process(content: string): Promise<ReadonlyArray<bg.CsvParsedRowType>> {
    return csv.parse(content, { columns: true, trim: true, skip_empty_lines: true }).toArray();
  }
}

export const CsvParser = new CsvParserAdapter();
