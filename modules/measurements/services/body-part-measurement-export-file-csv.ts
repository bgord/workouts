// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class BodyPartMeasurementExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly measurements: ReadonlyArray<VO.BodyPartMeasurement>,
    private readonly bodyParts: ReadonlyArray<VO.BodyPart>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `body-part-measurement-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    const names = new Map(this.bodyParts.map((bodyPart) => [bodyPart.id, bodyPart.name]));

    return this.deps.CsvStringifier.process(
      ["id", "bodyPartId", "bodyPartName", "value", "measuredOn"],
      this.measurements.map((measurement) => ({
        id: measurement.id,
        bodyPartId: measurement.bodyPartId,
        bodyPartName: names.get(measurement.bodyPartId) ?? "",
        value: measurement.value,
        measuredOn: measurement.measuredOn,
      })),
    );
  }
}
