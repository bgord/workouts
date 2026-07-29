// fallow-ignore-file unused-export
import { Link } from "@tanstack/react-router";
import { exerciseCategoryRoute } from "../router";

export function ExerciseCategory() {
  const { exerciseCategory } = exerciseCategoryRoute.useLoaderData();

  if (!exerciseCategory) return null;

  return (
    <main data-gap="8" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <h1>Exercise category</h1>

      <header>{exerciseCategory.name}</header>

      <div>Exercises</div>
      <ul>
        {exerciseCategory.exercises.map((exercise) => (
          <li key={exercise.id}>
            <Link>{exercise.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
