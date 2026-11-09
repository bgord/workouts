import * as bg from "@bgord/ui";
import * as ui from "../components";
import { SearchX } from "../icons";
import { workoutRoute } from "../router";

export function WorkoutNotFound() {
  const t = bg.useTranslations();
  const search = workoutRoute.useSearch();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack search={search} to="/workouts" />

          <h1>{t("workout.not_found")}</h1>
        </div>

        <ui.EmptyState>
          <ui.EmptyStateIcon icon={SearchX} />

          <ui.EmptyStateMessage>{t("workout.not_found.hint")}</ui.EmptyStateMessage>

          <ui.EmptyStateLink search={search} to="/workouts">
            {t("workout.not_found.cta")}
          </ui.EmptyStateLink>
        </ui.EmptyState>
      </div>
    </ui.Main>
  );
}
