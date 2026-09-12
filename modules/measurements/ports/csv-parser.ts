export type CsvParsedRowType = Record<string, string>;

export interface CsvParserPort {
  process(content: string): Promise<ReadonlyArray<CsvParsedRowType>>;
}
