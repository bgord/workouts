import { Spacing } from "./spacing";

export function Main(props: React.JSX.IntrinsicElements["main"]) {
  return (
    <main data-maxw="md" data-mx="auto" data-stack="y" {...Spacing.gutter} {...Spacing.page} {...props} />
  );
}
