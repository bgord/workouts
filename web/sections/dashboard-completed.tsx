import { useTranslations } from "@bgord/ui";
import { Eyebrow } from "../components";
import { dashboardRoute } from "../router";

const column = { flexBasis: 0 };

export function DashboardCompleted() {
  const t = useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();

  const tiles = [
    { label: "dashboard.completed.month", value: dashboard.completed.month },
    { label: "dashboard.completed.year", value: dashboard.completed.year },
    { label: "dashboard.completed.total", value: dashboard.completed.total },
  ] as const;

  return (
    <section data-gap="2" data-stack="y">
      <Eyebrow>{t("dashboard.completed.header")}</Eyebrow>

      <ul className="c-card" data-p="4" data-stack="x" data-variant="sunken">
        {tiles.map((tile, index) => (
          <li
            data-bcl="alpha-subtle"
            data-bsl="solid"
            data-bwl={index === 0 ? "none" : "hairline"}
            data-cross="center"
            data-gap="0-5"
            data-grow="1"
            data-stack="y"
            key={tile.label}
            style={column}
          >
            <div
              data-color="neutral-0"
              data-fs="xl"
              data-fw="semibold"
              data-lh="tight"
              data-transform="font-variant-numeric"
            >
              {tile.value}
            </div>

            <div data-color="neutral-500" data-fs="xs">
              {t(tile.label)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
