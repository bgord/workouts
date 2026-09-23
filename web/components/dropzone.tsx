import type * as bg from "@bgord/ui";
import { Gap } from "./gap";
import { Spacing } from "./spacing";

type DropzoneFile = { file: bg.UseFileReturnType };

export function Dropzone(props: React.JSX.IntrinsicElements["label"] & DropzoneFile) {
  const { file, ...rest } = props;

  return (
    <label
      data-bc="neutral-700"
      data-br="md"
      data-bs={file.isSelected ? "solid" : "dashed"}
      data-bw="hairline"
      data-color="neutral-400"
      data-cross="center"
      data-cursor={file.isSelected ? undefined : "pointer"}
      data-fs="xs"
      data-hover-bc={file.isSelected ? undefined : "brand-500"}
      data-main="center"
      data-stack="y"
      tabIndex={0}
      {...Spacing.surface}
      {...Gap.cluster}
      {...file.label.props}
      {...rest}
    />
  );
}

export function FileButton(props: React.JSX.IntrinsicElements["label"] & DropzoneFile) {
  const { file, ...rest } = props;

  return (
    <label
      className="c-button"
      data-main="center"
      data-minw="0"
      data-stack="x"
      data-variant="secondary"
      tabIndex={0}
      {...Gap.cluster}
      {...file.label.props}
      {...rest}
    />
  );
}

export function DropzoneInput(props: React.JSX.IntrinsicElements["input"] & DropzoneFile) {
  const { file, ...rest } = props;

  return (
    <input
      className="c-visually-hidden"
      disabled={file.isSelected}
      onChange={file.actions.selectFile}
      required
      type="file"
      {...file.input.props}
      {...rest}
    />
  );
}

export function DropzoneTitle(props: React.JSX.IntrinsicElements["span"]) {
  return <span data-color="neutral-300" {...props} />;
}

export function DropzoneFileName(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-color="neutral-100" data-fs="xs" data-maxw="100%" data-transform="truncate" {...props} />;
}
