import * as bg from "@bgord/ui";
import { CalendarOff, SearchX, X } from "lucide-react";
import * as WorkoutHistoryFiltersForm from "../../app/services/workout-history-filters-form";
import { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";
import {
  ChipButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateLink,
  EmptyStateMessage,
  IconButton,
  Meta,
  Select,
  WorkoutCard,
} from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function WorkoutHistory() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();
  const navigate = workoutsRoute.useNavigate();
  const search = workoutsRoute.useSearch();

  const filter = bg.useTextField<WorkoutListFilterOptions>({
    name: WorkoutHistoryFiltersForm.Form.filter.field.name,
    defaultValue: search.filter ?? WorkoutListFilterOptions.last_week,
  });

  const matching = workouts.data.filter(
    (workout) => !search.section || workout.planSectionId === search.section,
  );

  bg.useShortcuts({
    [ShortcutDefinitions.OpenWorkout.trigger]: () => {
      if (matching[0]) {
        navigate({ params: { workoutId: matching[0].id }, search, to: "/workouts/$workoutId" });
      }
    },
  });

  if (workouts.data.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalendarOff} />

        <EmptyStateMessage>{t("workout.list.empty")}</EmptyStateMessage>

        <Meta>{t("workout.list.empty.hint")}</Meta>

        <EmptyStateLink to="/plans">{t("workout.list.empty.cta")}</EmptyStateLink>
      </EmptyState>
    );
  }

  return (
    <div data-gap="4" data-stack="y">
      <div
        data-cross="center"
        data-gap="2"
        data-stack="x"
        data-wrap="wrap"
        {...bg.Rhythm(36).times(1).style.minHeight}
      >
        <Select
          aria-label={t("workout.list.filter.label")}
          id={WorkoutHistoryFiltersForm.Form.filter.field.name}
          name={WorkoutHistoryFiltersForm.Form.filter.field.name}
          onChange={(event) => {
            filter.handleChange(event);
            navigate({
              search: {
                section: search.section,
                filter:
                  event.currentTarget.value === WorkoutListFilterOptions.last_week
                    ? undefined
                    : (event.currentTarget.value as WorkoutListFilterOptions),
              },
              to: "/workouts",
            });
          }}
          value={filter.value}
        >
          {Object.values(WorkoutListFilterOptions).map((option) => (
            <option key={option} value={option}>
              {t(`workout.list.filter.${option}`)}
            </option>
          ))}
        </Select>

        <ul
          data-cross="center"
          data-gap="2"
          data-stack="x"
          data-wrap="wrap"
          {...bg.Rhythm(36).times(1).style.height}
        >
          {workouts.sections.map((section) => (
            <li key={section.id}>
              <ChipButton
                onClick={() =>
                  navigate({
                    search: {
                      section: search.section === section.id ? undefined : section.id,
                      filter: undefined,
                    },
                    to: "/workouts",
                  })
                }
                pressed={search.section === section.id}
              >
                {section.name}
              </ChipButton>
            </li>
          ))}
        </ul>

        <div data-color="neutral-500" data-fs="sm" data-transform="font-variant-numeric">
          {t("workout.list.count", { matching: matching.length, total: workouts.data.length })}
        </div>

        {!WorkoutHistoryFiltersForm.Form.isDefault(search) && (
          <IconButton
            aria-label={t("app.clear")}
            onClick={() => navigate({ search: WorkoutHistoryFiltersForm.Form.default, to: "/workouts" })}
            title={t("app.clear")}
          >
            <X data-size="sm" />
          </IconButton>
        )}
      </div>

      {matching.length === 0 && (
        <EmptyState>
          <EmptyStateIcon icon={SearchX} />

          <EmptyStateMessage>{t("workout.list.no_matches")}</EmptyStateMessage>

          <Meta>{t("workout.list.no_matches.hint")}</Meta>
        </EmptyState>
      )}

      <ul data-gap="2" data-stack="y">
        {matching.map((workout) => (
          <WorkoutCard key={workout.id} {...workout} />
        ))}
      </ul>
    </div>
  );
}
