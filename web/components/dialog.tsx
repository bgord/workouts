import * as bg from "@bgord/ui";
import { CircleAlert, RotateCcw } from "lucide-react";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";
import { Gap } from "./gap";

export function Dialog(props: bg.DialogPropsType) {
  return (
    <bg.Dialog
      data-md-mt="4"
      data-md-p="3"
      data-mt="8"
      data-overflow="auto"
      data-wrap="nowrap"
      style={{
        ...bg.Rhythm().times(50).width,
        maxHeight: "calc(100% - 4rem - env(safe-area-inset-top))",
        maxWidth: "calc(100% - 2rem)",
        top: "env(safe-area-inset-top)",
      }}
      {...Gap.stack}
      {...props}
    />
  );
}

export function DialogHeader(props: { disabled?: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div data-main="between" data-stack="x" {...Gap.related}>
      <strong data-color="neutral-100" data-transform="truncate">
        {props.children}
      </strong>
      <ButtonClose disabled={props.disabled} onClick={props.onClose} />
    </div>
  );
}

export function DialogBody(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-stack="y" {...Gap.related} {...props} />;
}

export function DialogInfo(props: { children: React.ReactNode }) {
  return (
    <p data-color="neutral-300" data-lh="loose">
      {props.children}
    </p>
  );
}

export function DialogStatus(
  props: React.JSX.IntrinsicElements["div"] & { variant: "irreversible" | "restorable" },
) {
  const t = bg.useTranslations();
  const { variant, ...rest } = props;

  return (
    <div
      data-color={variant === "irreversible" ? "danger-400" : "positive-400"}
      data-stack="x"
      {...Gap.cluster}
      {...rest}
    >
      {variant === "irreversible" && <CircleAlert data-shrink="0" data-size="sm" />}
      {variant === "restorable" && <RotateCcw data-shrink="0" data-size="sm" />}
      {t(`app.dialog.${variant}`)}
    </div>
  );
}

export function DialogError(props: { children: React.ReactNode }) {
  return (
    <output aria-live="assertive" data-color="danger-400" data-stack="x" {...Gap.cluster}>
      <CircleAlert data-shrink="0" data-size="md" />
      <span>{props.children}</span>
    </output>
  );
}

export function DialogFooter(props: { disabled?: boolean; onCancel: () => void; children: React.ReactNode }) {
  return (
    <div data-main="end" data-stack="x" data-wrap="wrap" {...Gap.inline}>
      <ButtonCancel disabled={props.disabled} onClick={props.onCancel} />
      {props.children}
    </div>
  );
}
