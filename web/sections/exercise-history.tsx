import { useLanguage, useTranslations } from "@bgord/ui";
import { DateFormat } from "../../app/services/date-format";
import type { ExerciseSession } from "../../modules/stats/value-objects/exercise-history";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseHistory(props: { history: ReadonlyArray<ExerciseSession> }) {
  const t = useTranslations();
  const language = useLanguage();

  return (
    <div data-gap="3" data-stack="y">
      <h2 data-color="neutral-0" data-fs="lg" data-fw="bold">
        {t("exercise.history.header")}
      </h2>

      {props.history.length === 0 && (
        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.history.empty")}
        </div>
      )}

      <ul data-gap="4" data-stack="y">
        {props.history.map((session) => (
          <li data-gap="1" data-stack="y" key={session.workoutId}>
            <div data-color="neutral-400" data-fs="sm">
              {DateFormat.dayWithWeekday(language, DateFormat.zoned(session.completedAt).toPlainDate())}
            </div>

            <ul data-gap="1" data-stack="y">
              {session.sets.map((set, index) => (
                <li
                  data-color="neutral-100"
                  data-fs="sm"
                  data-fw="medium"
                  key={`${session.workoutId}-${index}`}
                >
                  {t("workout.exercise.logged_set", { reps: set.reps, load: set.load / GRAMS_IN_KILOGRAM })}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
