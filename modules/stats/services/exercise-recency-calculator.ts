import * as tools from "@bgord/tools";
import type * as VO from "+stats/value-objects";

export class ExerciseRecencyCalculator {
  calculate(
    sessions: ReadonlyArray<VO.ExerciseSession>,
    now: tools.Timestamp,
  ): tools.IntegerNonNegativeType | undefined {
    const [latest] = sessions.toSorted((one, another) => another.completedAt - one.completedAt);

    if (!latest) return undefined;

    const elapsed = now.difference(tools.Timestamp.fromNumber(latest.completedAt)).toAbsolute();

    return tools.Int.nonNegative(Math.floor(elapsed.days));
  }
}
