import type * as bg from "@bgord/bun";

export type ActionState = {
  available: boolean;
  enabled: boolean;
  hints: ReadonlyArray<bg.TranslationsKeyType>;
};
