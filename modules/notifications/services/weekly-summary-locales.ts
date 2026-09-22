import type { SupportedLanguages } from "+supported-languages";

type LanguagesType = (typeof SupportedLanguages)[number];

export const locales: Record<LanguagesType, string> = { en: "en-GB", pl: "pl-PL" };
