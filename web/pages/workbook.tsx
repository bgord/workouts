// fallow-ignore-file unused-export

import { Link } from "@tanstack/react-router";
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
          <li key={exerciseCategory.id}>
            <Link
              params={{ exerciseCategoryId: exerciseCategory.id }}
              to="/workbook/exercise-category/$exerciseCategoryId"
            >
              {exerciseCategory.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
