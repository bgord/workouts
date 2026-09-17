import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../app/services/workout-history-filters-form";
import { Header, Main } from "./components";

export function NotFound() {
  const t = useTranslations();

  return (
    <Main>
      <Header data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
        {t("app.not_found.header")}
      </Header>

      <div data-color="neutral-400">{t("app.not_found.info")}</div>

      <Link className="c-link" data-mr="auto" search={WorkoutHistoryFilters.default} to="/">
        {t("app.not_found.cta")}
      </Link>
    </Main>
  );
}
