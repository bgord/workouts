import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../app/services/workout-history-filters-form";
import * as ui from "./components";

export function NotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-mt="8" data-stack="y" data-transform="center" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <div className="logo" data-color="brand-500" data-disp="flex" data-fs="6xl" />

          <div
            data-color="neutral-0"
            data-cross="baseline"
            data-fs="6xl"
            data-fw="black"
            data-lh="none"
            data-stack="x"
            data-transform="font-variant-numeric"
            {...ui.Gap.inline}
          >
            404
            <span data-color="neutral-500" data-fs="xl" data-fw="medium">
              {t("app.not_found.unit")}
            </span>
          </div>
        </div>

        <h1 data-color="neutral-100" data-fs="lg" data-fw="semibold" data-lh="snug">
          {t("app.not_found.header")}
        </h1>

        <div data-color="neutral-400">{t("app.not_found.info")}</div>
      </div>

      <Link
        className="c-button"
        data-self="center"
        data-variant="brand"
        search={WorkoutHistoryFilters.default}
        to="/"
      >
        {t("app.not_found.cta")}
      </Link>
    </ui.Main>
  );
}
