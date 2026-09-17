import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Eyebrow(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase" {...props} />;
}

function EyebrowAnchor(props: React.JSX.IntrinsicElements["a"]) {
  const { children, ...rest } = props;

  return (
    <a
      data-color="neutral-500"
      data-cross="center"
      data-fs="xs"
      data-gap="1"
      data-hover-color="brand-300"
      data-ls="wide"
      data-self="start"
      data-stack="x"
      data-transform="uppercase"
      {...rest}
    >
      {children}
      <ChevronRight data-size="xs" />
    </a>
  );
}

const EyebrowAnchorLink = createLink(EyebrowAnchor);

export const EyebrowLink: LinkComponent<typeof EyebrowAnchor> = (props) => (
  <EyebrowAnchorLink activeProps={{}} {...props} />
);
