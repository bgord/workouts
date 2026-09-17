import * as bg from "@bgord/ui";
import { CircleAlert, RotateCcw } from "lucide-react";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";
import { Spacing } from "./spacing";

export function Dialog(props: bg.DialogPropsType) {
  return (
    <bg.Dialog
      data-overflow="auto"
      data-wrap="nowrap"
      style={{
        ...bg.Rhythm().times(50).width,
        maxHeight: "calc(100% - 4rem)",
        maxWidth: "calc(100% - 2rem)",
      }}
      {...Spacing.dialog}
      {...props}
    />
  );
}

export function DialogHeader(props: { disabled?: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <div data-cross="center" data-main="between" data-stack="x" data-wrap="nowrap" {...Spacing.header}>
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
      data-stack="x"
      data-wrap="nowrap"
      {...Spacing.icon}
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
      data-stack="x"
      data-wrap="nowrap"
      {...Spacing.icon}
    >
      <CircleAlert data-shrink="0" data-size="md" />
      <span>{props.children}</span>
    </output>
  );
}

export function DialogFooter(props: { disabled?: boolean; onCancel: () => void; children: React.ReactNode }) {
  return (
    <div data-main="end" data-stack="x" {...Spacing.controls}>
      <ButtonCancel disabled={props.disabled} onClick={props.onCancel} />
      {props.children}
    </div>
  );
}
