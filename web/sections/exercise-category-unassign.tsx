import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { exerciseRoute } from "../router";

export function ExerciseCategoryUnassign(props: ExerciseCategory) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category/unassign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.data.id,
          exerciseCategoryId: props.id,
        }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true }),
  });

  if (!exercise.actions.categoryUnassign.available) return null;

  return (
    <button
      data-color="neutral-400"
      data-cursor="pointer"
      data-hover-color="danger-400"
      data-stack="x"
      disabled={!exercise.actions.categoryUnassign.enabled || mutation.isLoading}
      onClick={() => mutation.mutate()}
      title={t("exercise.category.unassign.cta", { name: props.name })}
      type="button"
    >
      <X data-size="xs" />
    </button>
  );
}
