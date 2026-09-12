import * as csv from "csv";
import type * as Measurements from "+measurements";

class CsvParserAdapter implements Measurements.Ports.CsvParserPort {
  async process(content: string): Promise<ReadonlyArray<Measurements.Ports.CsvParsedRowType>> {
    return csv.parse(content, { columns: true, trim: true, skip_empty_lines: true }).toArray();
  }
}

export const CsvParser = new CsvParserAdapter();
