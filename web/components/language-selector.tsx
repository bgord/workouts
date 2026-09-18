import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { rootRoute } from "../router";
import { Select } from "./select";

export function LanguageSelector() {
  const router = useRouter();
  const language = bg.useLanguage();
  const supportedLanguages = bg.useSupportedLanguages();
  const t = bg.useTranslations();

  return (
    <Select
      defaultValue={language}
      onChange={async (event) => {
        bg.Cookies.set("language", event.target.value);
        await router.invalidate({ filter: (r) => r.routeId === rootRoute.id, sync: true });
      }}
    >
      {Object.keys(supportedLanguages).map((language) => (
        <option key={language} value={language}>
          {t(`profile.change_language.${language}.value`)}
        </option>
      ))}
    </Select>
  );
}
