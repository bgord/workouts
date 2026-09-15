// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { CalendarPlus } from "lucide-react";
import { ActionHint, Header, Main } from "../components";
import { workoutsRoute } from "../router";
import { WorkoutCreate } from "../sections/workout-create";
import { WorkoutHistory } from "../sections/workout-history";
import * as ShortcutDefinitions from "../services/shortcuts";

export function Workouts() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const workoutCreate = bg.useToggle({ name: "workout-create" });

  bg.useShortcuts({
    [ShortcutDefinitions.ScheduleWorkout.trigger]: () => {
      if (workouts.actions.create.enabled) workoutCreate.enable();
    },
  });

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <Header data-grow="1">{t("workout.list.header")}</Header>

        <ActionHint action={workouts.actions.create} />

        <button
          className="c-button"
          data-md-width="100%"
          data-variant="primary"
          disabled={!workouts.actions.create.enabled}
          onClick={workoutCreate.toggle}
          type="button"
        >
          <CalendarPlus data-size="sm" />
          {t("workout.create.toggle.cta")}
        </button>
      </div>

      {workouts.actions.create.enabled && workoutCreate.on && <WorkoutCreate />}

      <WorkoutHistory />
    </Main>
  );
}
