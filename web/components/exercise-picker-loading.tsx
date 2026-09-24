import * as bg from "@bgord/ui";
import { ExerciseImagePlaceholder, ExerciseImageSize } from "./exercise-image";
import { HairlineRow } from "./hairline";
import { Spacing } from "./spacing";

export function ExercisePickerLoading() {
  const t = bg.useTranslations();

  return (
    <>
      <li className="c-visually-hidden">{t("exercise.picker.loading")}</li>

      {Array.from({ length: 16 }, (_, index) => (
        <HairlineRow aria-hidden first={index === 0} key={index} tone="subtle">
          <div data-px="3" data-stack="x" {...Spacing.rowCompact}>
            <span data-shrink="0" data-stack="x">
              <ExerciseImagePlaceholder size={ExerciseImageSize.xs} />
            </span>

            <span data-bg="alpha-subtle" data-br="sm" style={{ width: "40%", height: "1em" }} />
          </div>
        </HairlineRow>
      ))}
    </>
  );
}
