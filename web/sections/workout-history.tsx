import * as bg from "@bgord/ui";
import { CalendarOff, SearchX } from "lucide-react";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import { WorkoutCard } from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  const matching = workouts.data.filter(
    (workout) => !search.section || workout.planSectionId === search.section,
  );

  bg.useShortcuts({
    [ShortcutDefinitions.OpenWorkout.trigger]: () => {
      if (matching[0]) {
        navigate({
          params: { workoutId: matching[0].id },
          search: { section: search.section },
          to: "/workouts/$workoutId",
        });
      }
    },
  });

  if (workouts.data.length === 0) {
    return (
      <div className="c-card" data-cross="center" data-gap="1" data-py="8" data-stack="y" data-variant="flat">
        <CalendarOff data-color="neutral-600" data-size="md" />

        <div data-color="neutral-300" data-fs="sm" data-mt="2">
          {t("workout.list.empty")}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {t("workout.list.empty.hint")}
        </div>
      </div>
    );
  }

  return (
    <div data-gap="5" data-stack="y">
      <div
        data-cross="center"
        data-gap="2"
        data-stack="x"
        data-wrap="wrap"
        {...bg.Rhythm(36).times(1).style.minHeight}
      >
        <ul data-gap="1-5" data-stack="x" data-wrap="wrap">
          {workouts.sections.map((section) => (
            <li key={section.id}>
              <button
                aria-pressed={search.section === section.id}
                className="c-badge"
                data-cursor="pointer"
                data-variant={search.section === section.id ? "primary" : "outline"}
                onClick={() =>
                  navigate({
                    search: { section: search.section === section.id ? undefined : section.id },
                    to: "/workouts",
                  })
                }
                type="button"
              >
                {section.name}
              </button>
            </li>
          ))}
        </ul>

        <div data-color="neutral-500" data-fs="sm" data-grow="1" data-transform="font-variant-numeric">
          {t("workout.list.count", { matching: matching.length, total: workouts.data.length })}
        </div>

        {!WorkoutHistoryFiltersForm.Form.isDefault(search) && (
          <button
            className="c-button"
            data-variant="ghost"
            onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/workouts" })}
            type="button"
          >
            {t("app.clear")}
          </button>
        )}
      </div>

      {matching.length === 0 && (
        <div className="c-card" data-cross="center" data-gap="1" data-py="8" data-stack="y">
          <SearchX data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("workout.list.no_matches")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("workout.list.no_matches.hint")}
          </div>
        </div>
      )}

      <ul data-gap="2" data-stack="y">
        {matching.map((workout) => (
          <WorkoutCard key={workout.id} {...workout} />
        ))}
      </ul>
    </div>
  );
}
