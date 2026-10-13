import * as bg from "@bgord/ui";
import { History } from "lucide-react";
import type { PlanHistoryEntry } from "../../modules/plans/value-objects/plan-history-entry";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import * as ui from "../components";
import { usePlanHistory } from "../hooks/use-plan-history";
import { RepsSchemeFormat } from "../kits/reps-scheme.format";
import { planRoute } from "../router";

export function PlanHistory() {
  const t = bg.useTranslations();
  const format = bg.useDateFormat();
  const timeZone = bg.useTimeZone();
  const { plan } = planRoute.useLoaderData();

  const planHistory = bg.useToggle({ name: "plan-history" });
  const history = usePlanHistory(plan.data.id);

  const days = Map.groupBy(history.entries, (entry) =>
    bg.CalendarDay.fromInstant(entry.createdAt, timeZone).toString(),
  );

  return (
    <>
      <bg.MenuItem
        aria-haspopup="dialog"
        onClick={() => {
          planHistory.enable();
          history.load();
        }}
      >
        <History data-size="sm" />
        {t("plan.history.cta")}
      </bg.MenuItem>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...planHistory}>
        <ui.DialogHeader>{t("plan.history.header")}</ui.DialogHeader>

        {history.state === "error" && <ui.DialogError>{t("plan.history.error")}</ui.DialogError>}

        {history.entries.length > 0 && (
          <div
            aria-busy={history.state === "loading"}
            data-md-minh="unset"
            data-minh="0"
            data-overflow="auto"
            data-stack="y"
            {...ui.Gap.block}
          >
            {[...days].map(([day, entries]) => (
              <section aria-label={format.dayLabel(day)} data-stack="y" key={day} {...ui.Gap.related}>
                <h3 data-color="neutral-500" data-fs="xs" data-fw="medium">
                  {format.dayLabel(day)}
                </h3>

                <ul data-stack="y">
                  {entries.map((entry, index) => (
                    <PlanHistoryRow first={index === 0} key={entry.sequence} {...entry} />
                  ))}
                </ul>
              </section>
            ))}

            {history.next !== null && (
              <div data-main="center" data-stack="x">
                <ui.TextLink disabled={history.state === "loading"} onClick={history.more}>
                  {t("plan.history.more")}
                </ui.TextLink>
              </div>
            )}
          </div>
        )}

        <ui.DialogDismiss onClick={planHistory.disable} />
      </ui.Dialog>
    </>
  );
}

function PlanHistoryRow(props: PlanHistoryEntry & { first: boolean }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const timeZone = bg.useTimeZone();
  const format = bg.useDateFormat();

  const { planName, sectionName, exerciseName, prescription, position, text } = props.details;

  const key = text === null ? `plan.history.${props.name}.cleared` : `plan.history.${props.name}`;

  const value = prescription
    ? [
        t("exercise.sets_reps", {
          sets: prescription.sets,
          reps: RepsSchemeFormat[RepsScheme.of(prescription.reps)].prescription(prescription.reps),
        }),
        t(`progression.method.${prescription.progression}`),
        ...(prescription.rir === undefined ? [] : [`${t("workout.set.rir.label")} ${prescription.rir}`]),
      ].join(" · ")
    : text;

  return (
    <ui.HairlineRow data-cross="baseline" data-py="2" data-stack="x" first={props.first} {...ui.Gap.cluster}>
      <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
        <span data-color="neutral-200" data-fs="sm">
          {t(key, {
            planName: planName ?? "",
            sectionName: sectionName ?? "",
            exerciseName: exerciseName ?? t("plan.history.exercise.unknown"),
            position: position === undefined ? "" : position + 1,
          })}
        </span>

        {value && (
          <span data-color="neutral-400" data-fs="xs" data-transform="truncate" title={value}>
            {value}
          </span>
        )}
      </div>

      <time
        data-color="neutral-500"
        data-fs="xs"
        data-shrink="0"
        data-transform="font-variant-numeric"
        dateTime={bg.Clock.iso(props.createdAt)}
        title={format.instantFull(props.createdAt)}
      >
        {new Intl.DateTimeFormat(language, {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
          timeZone,
        }).format(props.createdAt)}
      </time>
    </ui.HairlineRow>
  );
}
