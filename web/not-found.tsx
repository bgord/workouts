import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../app/services/workout-history-filters-form";
import { Main } from "./components";

export function NotFound() {
  const t = useTranslations();

  return (
    <Main>
      <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
        {t("app.not_found.header")}
      </h1>

      <div data-color="neutral-500">{t("app.not_found.info")}</div>

      <Link className="c-link" data-mr="auto" search={WorkoutHistoryFilters.default} to="/">
        {t("app.not_found.cta")}
      </Link>
    </Main>
  );
}
