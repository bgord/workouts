import * as bg from "@bgord/ui";
import { CircleAlert, RotateCcw } from "lucide-react";
import { createContext, useContext } from "react";
import { ButtonCancel } from "./button-cancel";
import { ButtonClose } from "./button-close";
import { Gap } from "./gap";

const DialogHeaderId = createContext<string | undefined>(undefined);

export function Dialog(props: bg.DialogPropsType) {
  const header = `${props.props.target.id}-header`;

  return (
    <DialogHeaderId.Provider value={header}>
      <bg.Dialog
        aria-labelledby={header}
        data-md-mt="4"
        data-md-p="3"
        data-mt="8"
        data-overflow="auto"
        data-wrap="nowrap"
        onCancel={(event) => {
          event.preventDefault();
          if (!props.locked) props.disable();
        }}
        style={{
          ...bg.Rhythm().times(50).width,
          maxHeight: "calc(100% - 4rem - env(safe-area-inset-top))",
          maxWidth: "calc(100% - 2rem)",
          top: "env(safe-area-inset-top)",
        }}
        {...Gap.stack}
        {...props}
      />
    </DialogHeaderId.Provider>
  );
}

export function DialogHeader(
  props: React.JSX.IntrinsicElements["div"] & { disabled?: boolean; onClose: () => void },
) {
  const id = useContext(DialogHeaderId);
  const { disabled, onClose, children, ...rest } = props;

  return (
    <div data-main="between" data-stack="x" {...Gap.related} {...rest}>
      <strong data-color="neutral-100" data-transform="truncate" id={id}>
        {children}
      </strong>
      <ButtonClose disabled={disabled} onClick={onClose} />
    </div>
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
    <div data-main="end" data-stack="x" data-wrap="wrap" {...Gap.inline} {...rest}>
      <ButtonCancel disabled={disabled} onClick={onCancel} />
      {children}
    </div>
  );
}
