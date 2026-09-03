// fallow-ignore-file unused-export

import { ExerciseCatalog } from "../sections/exercise-catalog";

export function Workbook() {
  return (
    <main data-gap="6" data-maxw="md" data-md-m="2" data-md-pb="16" data-mx="auto" data-stack="y">
      <h1 data-fs="lg">Exercise catalog</h1>

      <ExerciseCatalog />
    </main>
  );
}
