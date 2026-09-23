import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Gap } from "./gap";

function LogoAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return (
    <a data-main="center" data-stack="x" {...props}>
      <div
        className="logo"
        data-color="brand-500"
        data-cross="center"
        data-disp="flex"
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
