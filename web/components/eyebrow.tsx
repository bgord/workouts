import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Gap } from "./gap";

function EyebrowAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const { children, ...rest } = props;

  return (
    <h3 data-self="start">
      <a data-color="neutral-500" data-hover-color="brand-300" data-stack="x" {...Gap.inline} {...rest}>
        {children}
        <ChevronRight data-size="xs" />
      </a>
    </h3>
  );
}

const EyebrowAnchorLink = createLink(EyebrowAnchor);

export const EyebrowLink: LinkComponent<typeof EyebrowAnchor> = (props) => (
  <EyebrowAnchorLink activeProps={{}} {...props} />
);
