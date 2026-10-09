import * as bg from "@bgord/ui";
import { Circle, Contrast } from "lucide-react";
import { ExerciseCategoryRoleOptions } from "../../modules/exercises/value-objects/exercise-category-role-options";

const icons = {
  [ExerciseCategoryRoleOptions.primary]: <Circle data-size="xs" fill="currentColor" />,
  [ExerciseCategoryRoleOptions.secondary]: <Contrast data-size="xs" />,
};

export function CategoryRoleIcon(
  props: React.JSX.IntrinsicElements["span"] & { value: ExerciseCategoryRoleOptions },
) {
  const t = bg.useTranslations();
  const { value, ...span } = props;

  const label = t(`exercise.category.role.${value}`);

  return (
    <span aria-label={label} data-disp="flex" role="img" title={label} {...span}>
      {icons[value]}
    </span>
  );
}
