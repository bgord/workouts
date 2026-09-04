// fallow-ignore-file unused-export
import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { ExerciseImage, ExerciseImageSize, Main } from "../components";
import { exerciseRoute } from "../router";

export function Exercise() {
  const t = useTranslations();
  const { exercise } = exerciseRoute.useLoaderData();

  return (
    <Main>
      <Link className="c-link" search={Form.default} to="/catalog">
        {`< ${t("app.back")}`}
      </Link>

      {!exercise && <div data-color="neutral-500">{t("exercise.not_found")}</div>}

      {exercise && (
        <div data-gap="4" data-stack="y">
          <ExerciseImage exercise={exercise} size={ExerciseImageSize.lg} />

          <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">{exercise.name}</h1>

          <ul data-gap="1" data-stack="x">
            {exercise.categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="c-badge"
                  data-variant="outline"
                  search={{ category: category.id, name: Form.default.name }}
                  to="/catalog"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <p data-color="neutral-300" data-fs="sm">
            {exercise.description}
          </p>
        </div>
      )}
    </Main>
  );
}
