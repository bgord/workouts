// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutNotFound() {
  const t = bg.useTranslations();
  const search = workoutRoute.useSearch();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-cross="center" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack search={search} to="/workouts" />

          <ui.Header>{t("workout.not_found")}</ui.Header>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <ui.Meta>{t("workout.not_found.hint")}</ui.Meta>

          <Link className="c-link" data-fs="sm" data-mr="auto" search={search} to="/workouts">
            {t("workout.not_found.cta")}
          </Link>
        </div>
      </div>
    </ui.Main>
  );
}
