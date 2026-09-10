import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import { ActionHint, Select } from "../components";
import { exerciseRoute } from "../router";
import { ExerciseCategoryUnassign } from "./exercise-category-unassign";

export function ExerciseCategories(props: { exercise: ExerciseGetResponse }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exerciseCategories } = exerciseRoute.useLoaderData();

  const assigned = props.exercise.data.categories;
  const assignable = exerciseCategories.data.filter(
    (category) => !assigned.some((current) => current.id === category.id),
  );

  const exerciseCategoryId = bg.useTextField({
    name: "exercise-category-assign",
    defaultValue: assignable[0]?.id ?? "",
  });

  const refresh = () => router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });

  const assign = bg.useMutation({
    perform: async () =>
      fetch("/api/exercises/category/assign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: props.exercise.data.id,
          exerciseCategoryId: exerciseCategoryId.value,
        }),
      }),
    onSuccess: refresh,
  });

  return (
    <div data-cross="center" data-gap="3" data-stack="x" data-wrap="wrap">
      <ul data-gap="1" data-stack="x">
        {assigned.map((category) => (
          <li className="c-badge" data-cross="center" data-gap="1" data-variant="outline" key={category.id}>
            {category.name}

            {props.exercise.actions.categoryUnassign.available && (
              <ExerciseCategoryUnassign category={category} exerciseId={props.exercise.data.id} />
            )}
          </li>
        ))}
      </ul>

      {props.exercise.actions.categoryAssign.available && assignable.length > 0 && (
        <form data-cross="center" data-gap="2" data-stack="x" onSubmit={assign.handleSubmit}>
          <Select
            aria-label={t("exercise.category.assign.label")}
            disabled={!props.exercise.actions.categoryAssign.enabled}
            {...exerciseCategoryId.input.props}
          >
            {assignable.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <button
            className="c-button"
            data-variant="ghost"
            disabled={!props.exercise.actions.categoryAssign.enabled || assign.isLoading}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("exercise.category.assign.cta")}
          </button>

          <ActionHint action={props.exercise.actions.categoryAssign} />
        </form>
      )}

      {assign.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.category.assign.error")}
        </output>
      )}
    </div>
  );
}
