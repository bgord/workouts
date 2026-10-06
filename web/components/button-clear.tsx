import * as bg from "@bgord/ui";

export function ButtonClear(props: React.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <button className="c-button" data-variant="ghost" type="button" {...props}>
      {t("app.clear")}
    </button>
  );
}
