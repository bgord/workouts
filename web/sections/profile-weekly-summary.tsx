import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Mail } from "lucide-react";
import { WeeklySummaryOptions } from "../../modules/preferences/value-objects/weekly-summary-options";
import * as ui from "../components";
import { profileRoute } from "../router";

const options = [WeeklySummaryOptions.on, WeeklySummaryOptions.off];

export function ProfileWeeklySummary() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { weeklySummary } = profileRoute.useLoaderData();

  const field = bg.useTextField<WeeklySummaryOptions>({
    name: "weekly-summary",
    defaultValue: weeklySummary,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/preferences/weekly-summary/update", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ weeklySummary: field.value }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (match) => match.routeId === profileRoute.id, sync: true });
    },
  });

  return (
    <section className="c-card" data-variant="flat" {...ui.Spacing.surface} {...ui.Gap.related}>
      <div data-stack="x" {...ui.Gap.cluster}>
        <Mail data-color="neutral-400" data-size="sm" />
        <h2>{t("profile.weekly_summary.header")}</h2>
      </div>

      <div data-color="neutral-500">{t("profile.weekly_summary.hint")}</div>

      <form
        aria-busy={mutation.isLoading}
        data-stack="x"
        data-wrap="wrap"
        onSubmit={mutation.handleSubmit}
        {...ui.Gap.inline}
      >
        <ui.Select {...field.input.props}>
          {options.map((option) => (
            <option key={option} value={option}>
              {t(`profile.weekly_summary.${option}.value`)}
            </option>
          ))}
        </ui.Select>

        <ui.IconButton
          aria-label={t("app.save")}
          disabled={field.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>
      </form>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("profile.weekly_summary.error")}
        </output>
      )}
    </section>
  );
}
