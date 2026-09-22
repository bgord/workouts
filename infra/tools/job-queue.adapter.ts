import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import * as Emails from "+emails";
import type * as Measurements from "+measurements";
import * as Notifications from "+notifications";
import type * as Preferences from "+preferences";
import type { SupportedLanguages } from "+supported-languages";
import type * as Workouts from "+workouts";
import type { EnvironmentResultType } from "+infra/env";

type LanguagesType = (typeof SupportedLanguages)[number];

type Dependencies = {
  Clock: bg.ClockPort;
  IdProvider: bg.IdProviderPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  Mailer: bg.MailerPort;
  TranslationsProvider: bg.TranslationsProviderPort;
  EventStore: bg.EventStorePort<
    Notifications.Events.WeeklySummarySentEventType | Notifications.Events.WeeklySummarySkippedEventType
  >;
  GetWeeklySummaryStatusQuery: Notifications.Queries.GetWeeklySummaryStatus;
  WeeklySummaryOHQ: Preferences.OHQ.WeeklySummaryOHQ;
  UserContactOHQ: Auth.OHQ.UserContactOHQ;
  UserLanguageOHQ: bg.Preferences.OHQ.UserLanguagePort<LanguagesType>;
  ListWeekCompletedWorkoutsOHQ: Workouts.OHQ.ListWeekCompletedWorkoutsOHQ;
  ListWeekExercisePerformancesOHQ: Workouts.OHQ.ListWeekExercisePerformancesOHQ;
  GetWorkoutDashboardOHQ: Workouts.OHQ.GetWorkoutDashboardOHQ;
  ListBodyWeightMeasurementsOHQ: Measurements.OHQ.ListBodyWeightMeasurementsOHQ;
};

type AcceptedJob = bg.System.Jobs.SendEmailJobType | Notifications.Jobs.WeeklySummaryComposeJobType;

const retry = new bg.JobRetryPolicyCompositeStrategy([
  new bg.JobRetryPolicyLimitStrategy(tools.Int.nonNegative(3)),
  new bg.JobRetryPolicyBackoffStrategy(new bg.RetryBackoffLinearStrategy(tools.Duration.Minutes(1))),
]);

const WeeklySummaryEmailRenderer: Notifications.Services.WeeklySummaryEmailRenderer = {
  render: (content) => Emails.renderEmail(Emails.WeeklySummaryEmail, content),
};

export async function createJobQueue(
  Env: EnvironmentResultType,
  deps: Dependencies,
): Promise<{
  JobQueue: bg.JobQueuePort<AcceptedJob>;
  JobQueueStatsProvider: bg.JobQueueStatsProviderPort;
  JobPruner: bg.JobPrunerPort;
}> {
  const store = new bg.JobQueueSqliteStore({ database: "jobs.db" });

  const JobDispatcher: bg.JobDispatcherPort<AcceptedJob> = { enqueue: (job) => JobQueue.enqueue(job) };

  const registry = new bg.JobRegistryAdapter<AcceptedJob>({
    [bg.System.Jobs.SEND_EMAIL_JOB]: {
      schema: bg.System.Jobs.SendEmailJobSchema,
      retry,
      handler: bg.System.JobHandlers.SendEmailJobHandler(deps),
    },
    [Notifications.Jobs.WEEKLY_SUMMARY_COMPOSE_JOB]: {
      schema: Notifications.Jobs.WeeklySummaryComposeJobSchema,
      retry,
      handler: Notifications.JobHandlers.WeeklySummaryComposeJobHandler(
        { EMAIL_FROM: Env.EMAIL_FROM, BETTER_AUTH_URL: Env.BETTER_AUTH_URL },
        { ...deps, JobDispatcher, WeeklySummaryEmailRenderer },
      ),
    },
  });

  const JobQueue = new bg.JobQueueAdapter<AcceptedJob>({
    registry,
    enqueuer: new bg.JobEnqueuerSqliteAdapter({ db: store.db, ...deps }),
    claimer: new bg.JobClaimerSqliteAdapter({ db: store.db, ...deps }),
    completer: new bg.JobCompleterSqliteAdapter({ db: store.db }),
    failer: new bg.JobFailerSqliteAdapter({ db: store.db }),
    requeuer: new bg.JobRequeuerSqliteAdapter({ db: store.db, ...deps }),
    serializer: new bg.PayloadSerializerJsonAdapter(),
  });

  return {
    JobQueue: {
      [bg.NodeEnvironmentEnum.local]: JobQueue,
      [bg.NodeEnvironmentEnum.test]: new bg.JobQueueAdapterNoop<AcceptedJob>({ registry }),
      [bg.NodeEnvironmentEnum.staging]: JobQueue,
      [bg.NodeEnvironmentEnum.production]: JobQueue,
    }[Env.type],

    JobQueueStatsProvider: {
      [bg.NodeEnvironmentEnum.local]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.test]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.staging]: new bg.JobQueueStatsProviderNoopAdapter(),
      [bg.NodeEnvironmentEnum.production]: new bg.JobQueueStatsProviderSqliteAdapter(store),
    }[Env.type],

    JobPruner: {
      [bg.NodeEnvironmentEnum.local]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.test]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.staging]: new bg.JobPrunerNoopAdapter(),
      [bg.NodeEnvironmentEnum.production]: new bg.JobPrunerSqliteAdapter({ db: store.db, ...deps }),
    }[Env.type],
  };
}
