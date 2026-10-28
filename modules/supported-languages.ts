export const SupportedLanguages = ["en", "pl"] as const;

export type SupportedLanguagesType = (typeof SupportedLanguages)[number];
