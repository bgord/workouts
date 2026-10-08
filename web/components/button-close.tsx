import * as bg from "@bgord/ui";

export function ButtonClose(props: React.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <button className="c-button" data-variant="secondary" type="button" {...props}>
      {t("app.close")}
    </button>
  );
}
