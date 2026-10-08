import * as bg from "@bgord/ui";
import { CircleAlert, RotateCcw } from "lucide-react";
import { createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";
import { Gap } from "./gap";

const DialogHeaderId = createContext<string | undefined>(undefined);

export function Dialog(props: bg.DialogPropsType) {
  const hydrated = bg.useHydrated();
  const parent = useContext(DialogHeaderId);
  const header = `${props.props.target.id}-header`;

  if (!hydrated) return null;

  const dialog = (
    <DialogHeaderId.Provider value={header}>
      <bg.Dialog
        aria-labelledby={header}
        data-bc="alpha-soft"
        data-br="xl"
        data-bs="solid"
        data-bw="hairline"
        data-dialog
        data-md-bottom="0"
        data-md-bwb="none"
        data-md-mb="0"
        data-md-pt="2"
        data-md-px="4"
        data-md-top="auto"
        data-mt="8"
        data-overflow="auto"
        data-top="0"
        data-wrap="nowrap"
        onCancel={(event) => {
          event.preventDefault();
          if (!props.locked) props.disable();
        }}
        {...Gap.stack}
        {...props}
      >
        <div
          aria-hidden
          data-bg="neutral-700"
          data-br="pill"
          data-disp="none"
          data-md-disp="block"
          data-mx="auto"
          data-shrink="0"
          style={{ width: 36, height: 4 }}
        />
        {props.children}
      </bg.Dialog>
    </DialogHeaderId.Provider>
  );

  return parent ? dialog : createPortal(dialog, document.body);
}

export function DialogHeader(props: React.JSX.IntrinsicElements["strong"]) {
  const id = useContext(DialogHeaderId);

  return (
    <strong
      data-color="neutral-0"
      data-fs="base"
      data-fw="semibold"
      data-shrink="0"
      data-transform="truncate"
      id={id}
      {...props}
    />
  );
}

export function DialogBody(props: React.JSX.IntrinsicElements["div"]) {
  return <div data-stack="y" {...Gap.related} {...props} />;
}

export function DialogInfo(props: React.JSX.IntrinsicElements["p"]) {
  return <p data-color="neutral-300" data-lh="loose" {...props} />;
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

export function DialogError(props: React.JSX.IntrinsicElements["output"]) {
  const { children, ...rest } = props;

  return (
    <output aria-live="assertive" data-color="danger-400" data-stack="x" {...Gap.cluster} {...rest}>
      <CircleAlert data-shrink="0" data-size="md" />
      <span>{children}</span>
    </output>
  );
}

export function DialogFooter(
  props: React.JSX.IntrinsicElements["div"] & { disabled?: boolean; onCancel: () => void },
) {
  const { disabled, onCancel, children, ...rest } = props;

  return (
    <div data-main="end" data-stack="x" data-wrap="wrap" {...Gap.cluster} {...rest}>
      <ButtonCancel disabled={disabled} onClick={onCancel} />
      {children}
    </div>
  );
}

export function DialogDismiss(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <div data-main="end" data-stack="x">
      <ButtonClose {...props} />
    </div>
  );
}
