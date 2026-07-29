// fallow-ignore-file unused-export

import { exercisesRoute } from "../router";

export function Exercises() {
  const { exerciseCategories } = exercisesRoute.useLoaderData();

  return (
    <main data-gap="8" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <h1>Exercise categories</h1>
      <ul>
        {exerciseCategories.map((exerciseCategory) => (
          <li key={exerciseCategory.id}>{exerciseCategory.name}</li>
        ))}
      </ul>
    </main>
  );
}
