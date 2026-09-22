import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import type * as Notifications from "+notifications";
import * as Preferences from "+preferences";
import type { SupportedLanguages } from "+supported-languages";
import type * as Workouts from "+workouts";
import { WeeklySummarySentEvent } from "../events/WEEKLY_SUMMARY_SENT_EVENT";
import { WeeklySummarySkippedEvent } from "../events/WEEKLY_SUMMARY_SKIPPED_EVENT";
import { WeeklySummaryBodyWeight } from "../services/weekly-summary-body-weight";
import { WeeklySummaryRange } from "../services/weekly-summary-range";
import { WeeklySummaryTotals } from "../services/weekly-summary-totals";
import { WeeklySummaryStream } from "../value-objects/weekly-summary-stream";

type LanguagesType = (typeof SupportedLanguages)[number];

type AcceptedEvent =
  | Notifications.Events.WeeklySummarySentEventType
  | Notifications.Events.WeeklySummarySkippedEventType;

type Config = { EMAIL_FROM: tools.EmailType; BETTER_AUTH_URL: tools.UrlWithoutSlashType };

type Dependencies = {
  EventStore: bg.EventStorePort<AcceptedEvent>;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  JobDispatcher: bg.JobDispatcherPort<bg.System.Jobs.SendEmailJobType>;
  TranslationsProvider: bg.TranslationsProviderPort;
  GetWeeklySummaryStatusQuery: Notifications.Queries.GetWeeklySummaryStatus;
  WeeklySummaryOHQ: Preferences.OHQ.WeeklySummaryOHQ;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  ListWeekCompletedWorkoutsOHQ: Workouts.OHQ.ListWeekCompletedWorkoutsOHQ;
  ListBodyWeightMeasurementsOHQ: Measurements.OHQ.ListBodyWeightMeasurementsOHQ;
  WeeklySummaryEmailRenderer: Notifications.Services.WeeklySummaryEmailRenderer;
};

export const WeeklySummaryComposeJobHandler =
  (config: Config, deps: Dependencies) =>
  async (job: Notifications.Jobs.WeeklySummaryComposeJobType): Promise<void> => {
    const status = await deps.GetWeeklySummaryStatusQuery.execute(job.payload.userId, job.payload.weekIsoId);
    if (status) return;

    const preference = await deps.WeeklySummaryOHQ.execute(job.payload.userId);
    if (preference === Preferences.VO.WeeklySummaryOptions.off) return;

    const contact = await deps.UserContactOHQ.getPrimary(job.payload.userId);
    if (!contact?.address) return;

    const week = tools.Week.fromIsoId(job.payload.weekIsoId);

    const [workouts, previousWorkouts, measurements] = await Promise.all([
      deps.ListWeekCompletedWorkoutsOHQ.execute(job.payload.userId, week),
      deps.ListWeekCompletedWorkoutsOHQ.execute(job.payload.userId, week.previous()),
      deps.ListBodyWeightMeasurementsOHQ.execute(job.payload.userId),
    ]);

    const stream = WeeklySummaryStream.of(job.payload.userId, job.payload.weekIsoId);

    if (workouts.length === 0) {
      await deps.EventStore.save([bg.event(WeeklySummarySkippedEvent, stream, job.payload, deps)]);
      return;
    }

    const language = await deps.UserLanguageOHQ.get(job.payload.userId);
    const translations = await deps.TranslationsProvider.getTranslationsFor(language);
    const t = bg.TranslatorService.use(translations);

    const range = WeeklySummaryRange.of(week, language);

    const html = await deps.WeeklySummaryEmailRenderer.render({
      title: range,
      totals: new WeeklySummaryTotals(workouts, previousWorkouts, t, language).tiles(),
      bodyWeight: new WeeklySummaryBodyWeight(measurements, week, t, language).stat(),
      footer: {
        before: t("notifications.weekly_summary.footer.before"),
        link: t("notifications.weekly_summary.footer.link"),
        after: t("notifications.weekly_summary.footer.after"),
        url: `${config.BETTER_AUTH_URL}/profile`,
      },
      signature: t("notifications.weekly_summary.signature"),
    });

    const email = bg.job(
      bg.System.Jobs.SendEmailJobSchema,
      {
        from: config.EMAIL_FROM,
        to: contact.address,
        subject: v.parse(bg.MailerSubject, t("notifications.weekly_summary.subject", { range })),
        html,
      },
      deps,
    );

    await deps.EventStore.save([bg.event(WeeklySummarySentEvent, stream, job.payload, deps)]);
    await deps.JobDispatcher.enqueue(email);
  };
