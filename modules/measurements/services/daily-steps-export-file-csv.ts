// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class DailyStepsExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly entries: ReadonlyArray<VO.DailySteps>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `daily-steps-export-${deps.Clock.now().ms}`),
      tools.Mimes.csv.extension,
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(["day", "count"], this.entries);
  }
}
