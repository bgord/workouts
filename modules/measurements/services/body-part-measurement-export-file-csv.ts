// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+measurements/queries";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class BodyPartMeasurementExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly rows: ReadonlyArray<Queries.BodyPartMeasurementExportRow>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `body-part-measurement-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(["id", "bodyPartName", "value", "measuredOn"], this.rows);
  }
}
