import { createLink } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Spacing } from "./spacing";

type RowVariant = "default" | "muted";

const opacity = { default: "full", muted: "high" } as const satisfies Record<RowVariant, string>;

export const RowLink = createLink((props: { variant?: RowVariant } & React.JSX.IntrinsicElements["a"]) => {
  const { variant = "default", ...rest } = props;

  return (
    <li>
      <a
        className="c-card"
        data-cross="center"
        data-gap="3"
        data-hover-bc="brand-500"
        data-opacity={opacity[variant]}
        data-stack="x"
        data-wrap="nowrap"
        {...Spacing.surface}
        {...rest}
      />
    </li>
  );
});

export function RowBody(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-gap="1" data-grow="1" data-stack="y" data-transform="truncate" {...props} />;
}

export function RowTitle(props: React.JSX.IntrinsicElements["div"]) {
  return <div className="c-card-title" data-transform="truncate" {...props} />;
}

export function RowChevron() {
  return <ChevronRight data-color="neutral-500" data-size="sm" />;
}
