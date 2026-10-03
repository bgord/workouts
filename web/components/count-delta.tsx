import * as bg from "@bgord/ui";
import { Delta } from "./delta";

export function CountDelta(
  props: { current: number; previous: number | undefined } & React.JSX.IntrinsicElements["span"],
) {
  const language = bg.useLanguage();

  return <Delta format={(difference) => difference.toLocaleString(language)} {...props} />;
}
