import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { exerciseRoute } from "../router";

export function ExerciseCategoryUnassign(props: ExerciseCategory & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();
  const { toggle: failure, rest: category } = bg.extractUseToggle(props);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category/unassign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.data.id,
          exerciseCategoryId: category.id,
        }),
      }),
    onSuccess: bg.exec([
      failure.disable,
      () => router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true }),
    ]),
    onError: failure.enable,
  });

  /* v8 ignore next */
  if (!exercise.actions.categoryUnassign.available) return null;

  return (
    <button
      aria-label={t("exercise.category.unassign.cta", { name: category.name })}
      data-color="neutral-400"
      data-cursor="pointer"
      data-hover-color="danger-400"
      data-stack="x"
      disabled={!exercise.actions.categoryUnassign.enabled || mutation.isLoading}
      onClick={() => mutation.mutate()}
      title={t("exercise.category.unassign.cta", { name: category.name })}
      type="button"
    >
      <X data-size="xs" />
    </button>
  );
}
