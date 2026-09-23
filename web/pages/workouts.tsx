// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { WorkoutCreate } from "../sections/workout-create";
import { WorkoutHistory } from "../sections/workout-history";
import { WorkoutsEmpty } from "../sections/workouts-empty";

export function Workouts() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
        <h1 data-grow="1">{t("workout.list.header")}</h1>

        <WorkoutCreate />
      </div>

      <WorkoutsEmpty />

      <WorkoutHistory />
    </ui.Main>
  );
}
