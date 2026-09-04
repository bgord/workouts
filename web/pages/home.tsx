// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Main, WorkoutCard } from "../components";
import { homeRoute } from "../router";
import { WorkoutCreate } from "../sections/workout-create";
import { WorkoutDiscard } from "../sections/workout-discard";

export function Home() {
  const t = useTranslations();
  const { workouts } = homeRoute.useLoaderData();

  return (
    <Main>
      <h1 data-fs="lg">{t("workout.list.header")}</h1>

      <WorkoutCreate />

      {workouts.length === 0 && <div data-color="neutral-500">{t("workout.list.empty")}</div>}

      {workouts.length > 0 && (
        <ul data-gap="3" data-stack="y">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout}>
              {workout.status === WorkoutStatusEnum.draft && <WorkoutDiscard workout={workout} />}
            </WorkoutCard>
          ))}
        </ul>
      )}
    </Main>
  );
}
