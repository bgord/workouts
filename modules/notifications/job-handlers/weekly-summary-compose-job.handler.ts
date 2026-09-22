import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Measurements from "+measurements";
import type * as Notifications from "+notifications";
import * as Preferences from "+preferences";
import type { SupportedLanguages } from "+supported-languages";
import type * as Workouts from "+workouts";
import { WeeklySummarySentEvent } from "../events/WEEKLY_SUMMARY_SENT_EVENT";
import { WeeklySummarySkippedEvent } from "../events/WEEKLY_SUMMARY_SKIPPED_EVENT";
import { WeeklySummaryCalculator } from "../services/weekly-summary-calculator";
import { WeeklySummaryNotificationComposer } from "../services/weekly-summary-notification-composer";
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
  ListWeekExercisePerformancesOHQ: Workouts.OHQ.ListWeekExercisePerformancesOHQ;
  GetWorkoutDashboardOHQ: Workouts.OHQ.GetWorkoutDashboardOHQ;
  ListBodyWeightMeasurementsOHQ: Measurements.OHQ.ListBodyWeightMeasurementsOHQ;
};

export const WeeklySummaryComposeJobHandler =
  (config: Config, deps: Dependencies) =>
  async (job: Notifications.Jobs.WeeklySummaryComposeJobType): Promise<void> => {
    const { userId, weekIsoId } = job.payload;

    const status = await deps.GetWeeklySummaryStatusQuery.execute(userId, weekIsoId);
    if (status) return;

    const preference = await deps.WeeklySummaryOHQ.execute(userId);
    if (preference === Preferences.VO.WeeklySummaryOptions.off) return;

    const contact = await deps.UserContactOHQ.getPrimary(userId);
    if (!contact?.address) return;

    const week = tools.Week.fromIsoId(weekIsoId);

    const [workouts, previousWorkouts, performances, measurements, dashboard] = await Promise.all([
      deps.ListWeekCompletedWorkoutsOHQ.execute(userId, week),
      deps.ListWeekCompletedWorkoutsOHQ.execute(userId, week.previous()),
      deps.ListWeekExercisePerformancesOHQ.execute(userId, week),
      deps.ListBodyWeightMeasurementsOHQ.execute(userId),
      deps.GetWorkoutDashboardOHQ.execute(userId, deps.Clock.now()),
    ]);

    const summary = new WeeklySummaryCalculator({
      week,
      workouts,
      previousWorkouts,
      performances,
      measurements,
      completed: dashboard.completed,
    }).calculate();

    const stream = WeeklySummaryStream.of(userId, weekIsoId);

    if (!summary) {
      await deps.EventStore.save([bg.event(WeeklySummarySkippedEvent, stream, { userId, weekIsoId }, deps)]);
      return;
    }

    const language = await deps.UserLanguageOHQ.get(userId);
    const translations = await deps.TranslationsProvider.getTranslationsFor(language);

    const composer = new WeeklySummaryNotificationComposer(config.BETTER_AUTH_URL, translations, language);
    const notification = composer.compose(summary);

    const email = bg.job(
      bg.System.Jobs.SendEmailJobSchema,
      { from: config.EMAIL_FROM, to: contact.address, ...notification },
      deps,
    );

    await deps.JobDispatcher.enqueue(email);
    await deps.EventStore.save([bg.event(WeeklySummarySentEvent, stream, { userId, weekIsoId }, deps)]);
  };
