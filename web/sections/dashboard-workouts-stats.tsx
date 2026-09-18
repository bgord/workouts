import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dashboardRoute } from "../router";

export function DashboardWorkoutStats() {
  const t = bg.useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();

  const tiles = [
    { label: "dashboard.completed.month", value: dashboard.completed.month },
    { label: "dashboard.completed.year", value: dashboard.completed.year },
    { label: "dashboard.completed.total", value: dashboard.completed.total },
  ] as const;

  return (
    <section data-stack="y" {...ui.Gap.cluster}>
      <ui.Eyebrow>{t("dashboard.completed.header")}</ui.Eyebrow>

      <ul className="c-card" data-stack="x" data-variant="sunken" {...ui.Spacing.surface}>
        {tiles.map((tile, index) => (
          <li
            data-basis="0"
            data-bcl="alpha-subtle"
            data-bsl="solid"
            data-bwl={index === 0 ? "none" : "hairline"}
            data-cross="center"
            data-grow="1"
            data-stack="y"
            key={tile.label}
            {...ui.Gap.inline}
          >
            <ui.TileValue>{tile.value}</ui.TileValue>

            <ui.Meta>{t(tile.label)}</ui.Meta>
          </li>
        ))}
      </ul>
    </section>
  );
}
