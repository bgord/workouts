import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";

type Dependencies = { CsvParser: bg.CsvParserPort };

const Row = v.object({ weight: VO.BodyWeight, measuredOn: VO.BodyWeightMeasuredOn });

export type BodyWeightMeasurementImportRow = v.InferOutput<typeof Row>;

export class BodyWeightMeasurementImportFileCsv {
  constructor(
    private readonly content: string,
    private readonly deps: Dependencies,
  ) {}

  async rows(): Promise<ReadonlyArray<BodyWeightMeasurementImportRow>> {
    const parsed = await this.deps.CsvParser.process(this.content);

    return parsed.map((row) =>
      v.parse(Row, {
        weight: row["weight"] ? Number(row["weight"]) : undefined,
        measuredOn: row["measuredOn"],
      }),
    );
  }
}
