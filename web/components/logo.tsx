import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { LogoMark } from "./logo-mark";

function LogoAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = bg.useTranslations();

  return (
    <a data-main="center" data-stack="x" {...props}>
      <span className="c-visually-hidden">{t("app.home")}</span>
      <LogoMark data-color="brand-500" data-fs="2xl" />
    </a>
  );
}

const LogoLink = createLink(LogoAnchor);

export const Logo: LinkComponent<typeof LogoAnchor> = (props) => <LogoLink activeProps={{}} {...props} />;
