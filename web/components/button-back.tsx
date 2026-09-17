import { useTranslations } from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Spacing } from "./spacing";

function ButtonBackAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = useTranslations();

  return (
    <a
      aria-label={t("app.back")}
      className="c-button"
      data-interaction="subtle-scale"
      data-self="start"
      data-shrink="0"
      data-variant="icon"
      title={t("app.back")}
      {...props}
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
    <a className="c-link" data-cross="center" data-stack="x" {...Spacing.inline} {...props}>
      <ChevronLeft data-size="sm" />
      {t("app.back")}
    </a>
  );
}

const LinkBackLink = createLink(LinkBackAnchor);

export const LinkBack: LinkComponent<typeof LinkBackAnchor> = (props) => (
  <LinkBackLink activeProps={{}} {...props} />
);
