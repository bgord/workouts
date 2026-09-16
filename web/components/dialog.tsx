import * as bg from "@bgord/ui";
import { CircleAlert, RotateCcw } from "lucide-react";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";

export function Dialog(props: bg.DialogPropsType) {
  return (
    <bg.Dialog
      data-gap="8"
      data-md-mt="4"
      data-md-p="3"
      data-mt="12"
      data-overflow="auto"
      data-wrap="nowrap"
      style={{
        ...bg.Rhythm().times(50).width,
        maxHeight: "calc(100% - 4rem)",
        maxWidth: "calc(100% - 2rem)",
      }}
      {...props}
    />
  );
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

export function DialogInfo(props: { children: React.ReactNode }) {
  return (
    <p data-color="neutral-300" data-fs="sm" data-lh="loose">
      {props.children}
    </p>
  );
}

export function DialogStatus(props: { variant: "irreversible" | "restorable" }) {
  const t = bg.useTranslations();

  return (
    <div
      data-color={props.variant === "irreversible" ? "danger-400" : "positive-400"}
      data-cross="center"
      data-fs="sm"
      data-gap="2"
      data-stack="x"
      data-wrap="nowrap"
    >
      {props.variant === "irreversible" && <CircleAlert data-shrink="0" data-size="sm" />}
      {props.variant === "restorable" && <RotateCcw data-shrink="0" data-size="sm" />}
      {t(`app.dialog.${props.variant}`)}
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

export function DialogFooter(props: { disabled?: boolean; onCancel: () => void; children: React.ReactNode }) {
  return (
    <div data-gap="1" data-main="end" data-stack="x">
      <ButtonCancel disabled={props.disabled} onClick={props.onCancel} />
      {props.children}
    </div>
  );
}
