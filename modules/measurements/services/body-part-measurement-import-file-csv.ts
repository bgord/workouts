import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";

type Dependencies = { CsvParser: bg.CsvParserPort };

const Row = v.object({
  bodyPartName: VO.BodyPartName,
  value: VO.BodyPartCircumference,
  measuredOn: VO.BodyPartMeasuredOn,
});

export type BodyPartMeasurementImportRow = v.InferOutput<typeof Row>;

export class BodyPartMeasurementImportFileCsv {
  constructor(
    private readonly content: string,
    private readonly deps: Dependencies,
  ) {}

  async rows(): Promise<ReadonlyArray<BodyPartMeasurementImportRow>> {
    const parsed = await this.deps.CsvParser.process(this.content);

    return parsed.map((row) =>
      v.parse(Row, {
        bodyPartName: row["bodyPartName"],
        value: row["value"] ? Number(row["value"]) : undefined,
        measuredOn: row["measuredOn"],
      }),
    );
  }
}
