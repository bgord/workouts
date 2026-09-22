import { createAuthAdapters } from "+infra/adapters/auth";
import { createExercisesAdapters } from "+infra/adapters/exercises";
import { createMeasurementsAdapters } from "+infra/adapters/measurements";
import { createPlansAdapters } from "+infra/adapters/plans";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createSystemAdapters } from "+infra/adapters/system";
import { createWorkoutsAdapters } from "+infra/adapters/workouts";
import { createEnvironmentLoader } from "+infra/env";
import { createTools } from "+infra/tools";
import { createJobQueue } from "+infra/tools/job-queue.adapter";

export async function bootstrap() {
  const EnvironmentLoader = await createEnvironmentLoader();
  const Env = await EnvironmentLoader.load();

  const System = await createSystemAdapters(Env);
  const Tools = await createTools(Env, System);

  const Auth = createAuthAdapters();
  const Preferences = createPreferencesAdapters();
  const Exercises = createExercisesAdapters();
  const Plans = createPlansAdapters({ ...System, ...Tools });
  const Workouts = createWorkoutsAdapters({ ...System, ...Tools });
  const Measurements = createMeasurementsAdapters();

  const { JobQueue, JobQueueStatsProvider, JobPruner } = await createJobQueue(Env, { ...System, ...Tools });

  return {
    Env,
    Adapters: { Auth, Preferences, System, Exercises, Plans, Workouts, Measurements },
    Tools: { ...Tools, JobQueue, JobQueueStatsProvider, JobPruner },
  };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
