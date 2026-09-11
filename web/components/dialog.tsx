import * as bg from "@bgord/ui";
import { CircleAlert, Info } from "lucide-react";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";

export function Dialog(props: bg.DialogPropsType) {
  return <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...props} />;
}

export function DialogHeader(props: { disabled?: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div data-cross="center" data-gap="3" data-main="between" data-stack="x" data-wrap="nowrap">
      <strong data-color="neutral-100" data-transform="truncate">
        {props.children}
      </strong>
      <ButtonClose data-shrink="0" disabled={props.disabled} onClick={props.onClose} />
    </div>
  );
}

export function DialogInfo(props: { variant: "danger" | "neutral"; children: React.ReactNode }) {
  return (
    <div
      data-color={props.variant === "danger" ? "danger-400" : "neutral-300"}
      data-cross="center"
      data-fs="sm"
      data-gap="3"
      data-lh="loose"
      data-stack="x"
      data-wrap="nowrap"
    >
      {props.variant === "danger" && <CircleAlert data-shrink="0" data-size="md" />}
      {props.variant === "neutral" && <Info data-shrink="0" data-size="md" />}
      <span>{props.children}</span>
    </div>
  );
}

export function DialogError(props: { children: React.ReactNode }) {
  return (
    <output
      aria-live="assertive"
      data-color="danger-400"
      data-cross="center"
      data-fs="sm"
      data-gap="3"
      data-stack="x"
      data-wrap="nowrap"
    >
      <CircleAlert data-shrink="0" data-size="md" />
      <span>{props.children}</span>
    </output>
  );
}

export function DialogFooter(props: { onCancel: () => void; children: React.ReactNode }) {
  return (
    <div data-gap="1" data-main="end" data-stack="x">
      <ButtonCancel onClick={props.onCancel} />
      {props.children}
    </div>
  );
}
