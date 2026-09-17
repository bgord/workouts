import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export function EmptyState(props: React.JSX.IntrinsicElements["div"]) {
  return (
    <div
      className="c-card"
      data-cross="center"
      data-gap="1"
      data-py="8"
      data-stack="y"
      data-variant="flat"
      {...props}
    />
  );
}

export function EmptyStateIcon(props: { icon: LucideIcon }) {
  return <props.icon data-color="neutral-600" data-size="md" />;
}

export function EmptyStateMessage(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-color="neutral-300" data-fs="sm" data-mt="2" {...props} />;
}

function EmptyStateAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return <a className="c-link" data-fs="sm" data-mt="2" {...props} />;
}

const EmptyStateAnchorLink = createLink(EmptyStateAnchor);

export const EmptyStateLink: LinkComponent<typeof EmptyStateAnchor> = (props) => (
  <EmptyStateAnchorLink activeProps={{}} {...props} />
);
