import { useTranslations } from "@bgord/ui";

export function ButtonClear(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button {...props} className="c-button" data-variant="ghost" type="button">
      {t("app.clear")}
    </button>
  );
}
