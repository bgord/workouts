import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

function ButtonBackAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const t = bg.useTranslations();
  const { href, ...rest } = props;

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
