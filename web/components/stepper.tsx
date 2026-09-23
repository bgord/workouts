import * as bg from "@bgord/ui";
import { Minus, Plus } from "lucide-react";

const control = bg.Rhythm(34).times(1).height;
const inputs = { ...control, textAlign: "center" as const, minWidth: 0, paddingInline: 0 };
const width = (value?: number): React.CSSProperties | undefined =>
  value ? ({ "--stepper-input": bg.Rhythm(value).times(1).width.width } as React.CSSProperties) : undefined;

export function Stepper(props: {
  field: bg.UseNumberFieldReturnType;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  width?: number;
  disabled?: boolean;
  variant?: "default" | "compact" | "fill";
  leading?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const variant = props.variant ?? "default";
  const value = props.field.value ?? props.min;
  const round = (next: number) => Number(next.toFixed(2));

  const decrement = () => props.field.set(round(Math.max(props.min, value - props.step)));
  const increment = () => props.field.set(round(Math.min(props.max, value + props.step)));

  return (
    <div
      data-bc="alpha-medium"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-grow={variant === "fill" ? "1" : undefined}
      data-md-grow={variant === "compact" ? undefined : "1"}
      data-overflow="hidden"
      data-shrink={variant === "fill" ? undefined : "0"}
      data-stack="x"
      data-stepper={variant}
      style={width(props.width)}
    >
      {props.leading}

      <button
        aria-label={`${props.label} −${props.step}`}
        data-color="neutral-400"
        data-cursor="pointer"
        data-focus-ring-offset="inset"
        data-hover-color="neutral-0"
        data-main="center"
        data-md-disp={variant === "compact" ? "none" : undefined}
        data-shrink="0"
        data-stack="x"
        disabled={props.disabled || value <= props.min}
        onClick={decrement}
        style={control}
        type="button"
      >
        <Minus data-size="sm" />
      </button>

      <input
        aria-label={props.label}
        className="c-input"
        data-br="none"
        data-bs="none"
        data-color="neutral-0"
        data-focus-ring-offset="inset"
        data-fw="medium"
        data-grow={variant === "fill" ? "1" : undefined}
        data-md-grow={variant === "compact" ? undefined : "1"}
        data-spin="none"
        data-transform="font-variant-numeric"
        disabled={props.disabled}
        max={props.max}
        min={props.min}
        step={props.step}
        type="number"
        {...props.field.input.props}
        style={{ ...inputs, ...(variant === "fill" ? { width: 0 } : {}) }}
      />

      {props.unit && (
        <span data-color="neutral-500" data-fs="xs" data-pr="2" data-shrink="0" data-unit>
          {props.unit}
        </span>
      )}

      <button
        aria-label={`${props.label} +${props.step}`}
        data-color="neutral-400"
        data-cursor="pointer"
        data-focus-ring-offset="inset"
        data-hover-color="neutral-0"
        data-main="center"
        data-md-disp={variant === "compact" ? "none" : undefined}
        data-shrink="0"
        data-stack="x"
        disabled={props.disabled || value >= props.max}
        onClick={increment}
        style={control}
        type="button"
      >
        <Plus data-size="sm" />
      </button>

      {props.children}
    </div>
  );
}
