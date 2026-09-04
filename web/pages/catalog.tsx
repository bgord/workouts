// fallow-ignore-file unused-export

import { Main } from "../components";
import { ExerciseCatalog } from "../sections/exercise-catalog";

export function Catalog() {
  return (
    <Main>
      <h1 data-fs="lg">Exercise catalog</h1>

      <ExerciseCatalog />
    </Main>
  );
}
