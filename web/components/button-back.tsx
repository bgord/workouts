import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Gap } from "./gap";

function ButtonBackAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = bg.useTranslations();
  const { href, children, ...rest } = props;

  if (children) {
    return (
      <a
        className="c-button"
        data-color="neutral-300"
        data-interaction="subtle-scale"
        data-pl="1"
        data-pr="3"
        data-self="start"
        data-variant="ghost"
        href={href}
        {...Gap.inline}
        {...rest}
      >
        <ChevronLeft data-size="md" />
        {children}
      </a>
    );
  }

  return (
    <a
      aria-label={t("app.back")}
      className="c-button"
      data-interaction="subtle-scale"
      data-self="start"
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
