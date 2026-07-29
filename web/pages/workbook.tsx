// fallow-ignore-file unused-export

import { workbookRoute } from "../router";
import { ExerciseCategoryAdd } from "../sections/exercise-category-add";

export function Workbook() {
  const { exerciseCategories } = workbookRoute.useLoaderData();

  return (
    <main data-gap="8" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <h1>Exercise categories</h1>
      <ExerciseCategoryAdd />
      <ul>
        {exerciseCategories.map((exerciseCategory) => (
          <li key={exerciseCategory.id}>{exerciseCategory.name}</li>
        ))}
      </ul>
    </main>
  );
}
