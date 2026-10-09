import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import type { ExerciseCategoryAssignment } from "../../modules/exercises/value-objects/exercise-category-assignment";
import { ExerciseCategoryRoleOptions } from "../../modules/exercises/value-objects/exercise-category-role-options";
import * as ui from "../components";
import { exerciseRoute } from "../router";

const options = Object.values(ExerciseCategoryRoleOptions);

export function ExerciseCategoryRoleSet(props: ExerciseCategoryAssignment) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const field = bg.useTextField<ExerciseCategoryRoleOptions>({
    name: `exercise-category-role-${props.id}`,
    defaultValue: props.role,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category/role-set", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.data.id,
          exerciseCategoryId: props.id,
          role: options.find((option) => option !== props.role),
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true }),
    onError: field.clear,
  });

  /* v8 ignore next */
  if (!exercise.actions.categoryRoleSet.available) return <ui.CategoryRoleIcon value={props.role} />;

  return (
    <label
      data-color="neutral-400"
      data-cursor="pointer"
      data-focus-within="ring"
      data-gap="0-5"
      data-hover-color="neutral-100"
      data-position="relative"
      data-stack="x"
      title={t("exercise.category.role.set.cta", { name: props.name })}
    >
      <ui.CategoryRoleIcon value={props.role} />
      <ChevronDown data-size="xs" />

      <select
        aria-label={t("exercise.category.role.set.cta", { name: props.name })}
        data-cursor="pointer"
        data-inset="0"
        data-opacity="none"
        data-position="absolute"
        disabled={!exercise.actions.categoryRoleSet.enabled || mutation.isLoading}
        {...field.input.props}
        onChange={(event) => {
          field.handleChange(event);
          mutation.mutate();
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {t(`exercise.category.role.${option}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
