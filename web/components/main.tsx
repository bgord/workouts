import { Gap } from "./gap";
import { Spacing } from "./spacing";

export function Main(props: React.JSX.IntrinsicElements["main"]) {
  return (
    <main
      data-maxw="md"
      data-md-mb="8"
      data-md-pt="2"
      data-mx="auto"
      data-pb="16"
      data-pt="6"
      data-stack="y"
      {...Spacing.gutter}
      {...Gap.section}
      {...props}
    />
  );
}
