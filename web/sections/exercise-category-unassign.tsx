import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleX } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import type { ExerciseIdType } from "../../modules/exercises/value-objects/exercise-id";
import { exerciseRoute } from "../router";

export function ExerciseCategoryUnassign(props: { exerciseId: ExerciseIdType; category: ExerciseCategory }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch("/api/exercises/category/unassign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: props.exerciseId,
          exerciseCategoryId: props.category.id,
        }),
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  return (
    <button
      data-color="neutral-400"
      data-cross="center"
      data-cursor="pointer"
      data-disp="flex"
      data-hover-color="danger-400"
      disabled={mutation.isLoading}
      onClick={() => mutation.mutate()}
      title={t("exercise.category.unassign.cta", { name: props.category.name })}
      type="button"
    >
      <CircleX data-size="xs" />
    </button>
  );
}
