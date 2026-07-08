import * as bg from "@bgord/bun";
import { SupportedLanguages } from "./supported-languages";

export const languages = new bg.Languages(SupportedLanguages, "en");
