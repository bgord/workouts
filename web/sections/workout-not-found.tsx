// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutNotFound() {
  const t = bg.useTranslations();
  const search = workoutRoute.useSearch();

  return (
    <ui.Main>
      <ui.LinkBack search={search} to="/workouts" />

      <div data-color="neutral-400">{t("workout.not_found")}</div>
    </ui.Main>
  );
}
