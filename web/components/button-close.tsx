import { X } from "lucide-react";

export function ButtonClose(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button className="c-button" data-interaction="subtle-scale" data-variant="icon" type="button" {...props}>
      <X data-size="md" />
    </button>
  );
}
