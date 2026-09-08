// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Main } from "../components";
import { WorkoutCreate } from "../sections/workout-create";
import { WorkoutHistory } from "../sections/workout-history";

export function Workouts() {
  const t = useTranslations();

  return (
    <Main>
      <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
        {t("workout.list.header")}
      </h1>

      <WorkoutCreate />

      <WorkoutHistory />
    </Main>
  );
}
