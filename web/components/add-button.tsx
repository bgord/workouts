import { Gap } from "./gap";

export function AddButton(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-color="neutral-400"
      data-cross="center"
      data-cursor="pointer"
      data-fs="sm"
      data-fw="medium"
      data-grow="1"
      data-hover-color="neutral-0"
      data-stack="x"
      data-wrap="nowrap"
      type="button"
      {...Gap.related}
      {...props}
    />
  );
}
