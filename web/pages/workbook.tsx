// fallow-ignore-file unused-export

import { ExerciseCard } from "../components";
import { workbookRoute } from "../router";

export function Workbook() {
  const { exercises } = workbookRoute.useLoaderData();

  return (
    <main data-gap="6" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <h1 data-fs="lg">Exercise catalog</h1>

      {exercises.length === 0 && <div data-color="neutral-500">No exercises in the catalog yet</div>}

      <ul data-gap="4" data-stack="x">
        {exercises.map((exercise) => (
          <ExerciseCard exercise={exercise} key={exercise.id} />
        ))}
      </ul>
    </main>
  );
}
