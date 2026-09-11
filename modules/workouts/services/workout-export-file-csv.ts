// cspell:ignore Stringifier
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Queries from "+workouts/queries";

type Dependencies = { CsvStringifier: bg.CsvStringifierPort; Clock: bg.ClockPort };

export class WorkoutExportFileCsv extends bg.FileDraft {
  constructor(
    private readonly rows: ReadonlyArray<Queries.WorkoutExportRow>,
    private readonly deps: Dependencies,
  ) {
    super(
      v.parse(tools.Basename, `workout-export-${deps.Clock.now().ms}`),
      v.parse(tools.Extension, "csv"),
      tools.Mimes.csv.mime,
    );
  }

  create() {
    return this.deps.CsvStringifier.process(
      [
        "workoutId",
        "completedAt",
        "planName",
        "planSectionName",
        "exerciseName",
        "setNumber",
        "reps",
        "load",
        "rir",
      ],
      this.rows,
    );
  }
}
