import type * as bg from "@bgord/bun";

export type ActionState = {
  available: boolean;
  enabled: boolean;
  hints: ReadonlyArray<bg.TranslationsKeyType>;
};

export type ActionBlocker = { passes: boolean; hint: bg.TranslationsKeyType };

export const ActionBlocker = {
  from<T extends Record<string, unknown>>(invariant: bg.Invariant<T>, config: T): ActionBlocker {
    return { passes: invariant.passes(config), hint: invariant.message };
  },
};

export const ActionState = {
  of(available: boolean, blockers: ReadonlyArray<ActionBlocker> = []): ActionState {
    const hints = available
      ? blockers.filter((blocker) => !blocker.passes).map((blocker) => blocker.hint)
      : [];

    return { available, enabled: available && hints.length === 0, hints };
  },
};
