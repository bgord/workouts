import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";

type Dependencies = { CsvParser: bg.CsvParserPort };

const Row = v.object({ day: VO.StepsDay, count: VO.StepsCount });

export type DailyStepsImportRow = v.InferOutput<typeof Row>;

export class DailyStepsImportFileCsv {
  constructor(
    private readonly content: string,
    private readonly deps: Dependencies,
  ) {}

  async rows(): Promise<ReadonlyArray<DailyStepsImportRow>> {
    const parsed = await this.deps.CsvParser.process(this.content);

    return parsed.map((row) =>
      v.parse(Row, { day: row["day"], count: row["count"] ? Number(row["count"]) : undefined }),
    );
  }
}
