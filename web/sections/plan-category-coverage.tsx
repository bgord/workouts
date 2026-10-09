import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";

const hatched = {
  background:
    "repeating-linear-gradient(-45deg, var(--color-brand-400) 0 2px, color-mix(in oklch, var(--color-brand-400) 25%, transparent) 2px 4px)",
};

const row = { display: "grid", gridTemplateColumns: "7rem minmax(0, 1fr) 2.5rem" };

const total = (value: number) => value.toFixed(Number.isInteger(value) ? 0 : 1);

export function PlanCategoryCoverage(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const { toggle } = bg.extractUseToggle(props);

  if (toggle.off || !plan.actions.coverageView.available) return null;

  return (
    <section
      className="c-card"
      data-stack="y"
      {...ui.Spacing.surface}
      {...ui.Gap.related}
      {...toggle.props.target}
    >
      <div data-stack="y" {...ui.Gap.inline}>
        <h3 data-color="neutral-100" data-fs="sm" data-fw="semibold" data-transform="none">
          {t("plan.coverage.title")}
        </h3>

        <small data-color="neutral-500" data-fs="xs">
          {t("plan.coverage.subtitle")}
        </small>
      </div>

      <ul aria-label={t("plan.coverage.title")} data-stack="y">
        {plan.coverage.map((entry, index) => (
          <ui.HairlineRow
            aria-label={t("plan.coverage.row", {
              name: entry.category.name,
              total: total(entry.total),
              primary: entry.primarySets,
              secondary: entry.secondarySets,
            })}
            data-cross="center"
            first={index === 0}
            key={entry.category.id}
            last={index === plan.coverage.length - 1}
            style={row}
            {...ui.Spacing.rowCompact}
          >
            <span data-transform="truncate">{entry.category.name}</span>

            <span
              aria-hidden
              data-bg="alpha-subtle"
              data-br="pill"
              data-stack="x"
              style={{ height: 6, overflow: "hidden" }}
            >
              <span data-bg="brand-400" style={{ height: "100%", width: `${entry.primaryShare * 100}%` }} />

              <span style={{ ...hatched, height: "100%", width: `${entry.secondaryShare * 100}%` }} />
            </span>

            <span data-main="end" data-stack="x" data-transform="font-variant-numeric">
              {total(entry.total)}
            </span>
          </ui.HairlineRow>
        ))}
      </ul>

      <div data-color="neutral-500" data-stack="x" data-wrap="wrap" {...ui.Gap.block}>
        <small data-cross="center" data-stack="x" {...ui.Gap.cluster}>
          <span aria-hidden data-bg="brand-400" data-br="pill" style={{ height: 6, width: 14 }} />

          {t("plan.coverage.legend.primary")}
        </small>

        <small data-cross="center" data-stack="x" {...ui.Gap.cluster}>
          <span aria-hidden data-br="pill" style={{ ...hatched, height: 6, width: 14 }} />

          {t("plan.coverage.legend.secondary")}
        </small>
      </div>
    </section>
  );
}
