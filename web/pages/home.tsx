// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Main } from "../components";
import { WorkoutCreate } from "../sections/workout-create";
import { WorkoutHistory } from "../sections/workout-history";

export function Home() {
  const t = useTranslations();

  return (
    <Main>
      <h1 data-fs="lg">{t("workout.list.header")}</h1>

      <WorkoutCreate />

      <WorkoutHistory />
    </Main>
  );
}
