import { useTranslations } from "@bgord/ui";
import { CalendarCheck } from "lucide-react";
import { dashboardRoute } from "../router";

export function DashboardCompleted() {
  const t = useTranslations();
  const { dashboard } = dashboardRoute.useLoaderData();

  const tiles = [
    { label: "dashboard.completed.month", value: dashboard.completed.month },
    { label: "dashboard.completed.year", value: dashboard.completed.year },
    { label: "dashboard.completed.total", value: dashboard.completed.total },
  ] as const;

  return (
    <section className="c-card" data-gap="5" data-p="5" data-variant="sunken">
      <div
        data-color="neutral-500"
        data-cross="center"
        data-fs="xs"
        data-gap="1-5"
        data-ls="wide"
        data-main="center"
        data-stack="x"
        data-transform="uppercase"
      >
        <CalendarCheck data-color="brand-400" data-size="xs" />
        {t("dashboard.completed.header")}
      </div>

      <ul data-stack="x">
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
          >
            <div
              data-color="neutral-0"
              data-fs="3xl"
              data-fw="black"
              data-lh="none"
              data-ls="tight"
              data-md-fs="2xl"
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
