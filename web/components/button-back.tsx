import { useTranslations } from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Gap } from "./gap";

function ButtonBackAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = useTranslations();
  const { href, ...rest } = props;

  return (
    <a
      aria-label={t("app.back")}
      className="c-button"
      data-interaction="subtle-scale"
      data-self="start"
      data-shrink="0"
      data-variant="icon"
      href={href}
      title={t("app.back")}
      {...rest}
    >
      <ChevronLeft data-size="md" />
    </a>
  );
}

const ButtonBackLink = createLink(ButtonBackAnchor);

export const ButtonBack: LinkComponent<typeof ButtonBackAnchor> = (props) => (
  <ButtonBackLink activeProps={{}} {...props} />
);

function LinkBackAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = useTranslations();

  return (
    <a className="c-link" data-cross="center" data-stack="x" {...Gap.inline} {...props}>
      <ChevronLeft data-size="sm" />
      {t("app.back")}
    </a>
  );
}

const LinkBackLink = createLink(LinkBackAnchor);

export const LinkBack: LinkComponent<typeof LinkBackAnchor> = (props) => (
  <LinkBackLink activeProps={{}} {...props} />
);
