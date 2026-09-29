// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class BodyPartMeasurementImportTemplateFileCsv extends bg.FileDraft {
  constructor(
    private readonly bodyPartNames: ReadonlyArray<VO.BodyPartNameType>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, "body-part-measurements-template"),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    const today = tools.Day.fromTimestamp(this.deps.Clock.now()).toIsoId();

    return this.deps.CsvStringifier.process(
      ["id", "bodyPartName", "value", "measuredOn"],
      this.bodyPartNames.map((bodyPartName) => ({ id: "", bodyPartName, value: "", measuredOn: today })),
    );
  }
}
