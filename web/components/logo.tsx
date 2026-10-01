import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Gap } from "./gap";

function LogoAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = bg.useTranslations();

  return (
    <a data-main="center" data-stack="x" {...props}>
      <span className="c-visually-hidden">{t("app.home")}</span>
      <div
        className="logo"
        data-color="brand-500"
        data-cross="center"
        data-fs="2xl"
        data-fw="bold"
        data-lh="none"
        data-ls="wider"
        data-transform="uppercase"
        {...Gap.cluster}
      />
    </a>
  );
}

const LogoLink = createLink(LogoAnchor);

export const Logo: LinkComponent<typeof LogoAnchor> = (props) => <LogoLink activeProps={{}} {...props} />;
