// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Main, WorkoutExerciseRow, WorkoutStatusBadge } from "../components";
import { workoutRoute } from "../router";

export function Workout() {
  const t = useTranslations();
  const language = useLanguage();
  const { workout } = workoutRoute.useLoaderData();

  return (
    <Main>
      <Link className="c-link" to="/">
        {`< ${t("app.back")}`}
      </Link>

      {!workout && <div data-color="neutral-500">{t("workout.not_found")}</div>}

      {workout && (
        <div data-cross="center" data-gap="3" data-stack="x">
          <h1 data-fs="lg" data-maxw="100%" data-transform="truncate" title={workout.planName}>
            {workout.planName}
          </h1>

          <WorkoutStatusBadge status={workout.status} />
        </div>
      )}

      {workout && (
        <div data-color="neutral-500" data-fs="sm">
          {Temporal.PlainDate.from(workout.scheduledFor).toLocaleString(language, {
            day: "numeric",
            month: "short",
            weekday: "short",
            year: "numeric",
          })}
        </div>
      )}

      {workout && (
        <ul data-gap="3" data-stack="y">
          {workout.exercises.map((exercise) => (
            <WorkoutExerciseRow exercise={exercise} key={exercise.id} />
          ))}
        </ul>
      )}
    </Main>
  );
}
