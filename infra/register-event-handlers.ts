import * as Exercises from "+exercises";
import { languages } from "+languages";
import * as Notifications from "+notifications";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import type { EnvironmentResultType } from "+infra/env";
import { registerProjectors } from "+infra/register-projectors";

export function registerEventHandlers(_Env: EnvironmentResultType, { Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  // Projections
  registerProjectors({ Adapters, Tools });

  // Policies
  new Preferences.Policies.SetDefaultUserLanguage(languages.fallback, deps);
  new Preferences.Policies.SetDefaultWeeklySummary(deps);
  new Preferences.Policies.ProfileAvatarEraser(deps);
  new Exercises.Policies.ExerciseDeleter(deps);
  new Notifications.Policies.WeeklySummaryScheduler({
    ...deps,
    UserDirectoryOHQ: Adapters.Auth.UserDirectoryOHQ,
  });
}
