import { Rhythm } from "@bgord/ui";

export function Header(props: React.JSX.IntrinsicElements["h1"]) {
  return (
    <h1
      data-color="neutral-0"
      data-cross="center"
      data-fs="2xl"
      data-fw="black"
      data-md-fs="xl"
      data-stack="x"
      {...Rhythm().times(3).style.minHeight}
      {...props}
    />
  );
}
