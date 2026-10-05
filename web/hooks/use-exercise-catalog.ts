import { useRef, useState } from "react";
import type {
  ExerciseCatalogItem,
  ExerciseCatalogResponse,
} from "../../modules/plans/queries/list-exercise-catalog";
import { Plans } from "../api";

export function useExerciseCatalog() {
  const request = useRef<Promise<ExerciseCatalogResponse> | null>(null);
  const [exercises, setExercises] = useState<Promise<ExerciseCatalogResponse> | null>(null);
  const [loaded, setLoaded] = useState<ReadonlyArray<ExerciseCatalogItem>>([]);

  const load = () => {
    if (request.current) return;

    request.current = Plans.exerciseCatalog(null);
    request.current.then((response) => setLoaded(response.data));
    setExercises(request.current);
  };

  const find = (exerciseId: string | null | undefined) =>
    loaded.find((exercise) => exercise.id === exerciseId);

  return { exercises, load, find };
}
