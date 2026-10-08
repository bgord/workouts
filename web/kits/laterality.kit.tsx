import { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import { UnilateralBadge, UnilateralGlyph, UnilateralMarker } from "../components/unilateral-badge";

type LateralityKitStrategy = {
  Badge: (props: React.JSX.IntrinsicElements["span"]) => React.ReactNode;
  Marker: (props: React.JSX.IntrinsicElements["span"]) => React.ReactNode;
  Glyph: (props: React.JSX.IntrinsicElements["svg"]) => React.ReactNode;
};

export const LateralityKit = {
  [ExerciseLateralityOptions.bilateral]: {
    Badge: () => null,
    Marker: () => null,
    Glyph: () => null,
  },
  [ExerciseLateralityOptions.unilateral]: {
    Badge: UnilateralBadge,
    Marker: UnilateralMarker,
    Glyph: UnilateralGlyph,
  },
} satisfies Record<ExerciseLateralityOptions, LateralityKitStrategy>;
