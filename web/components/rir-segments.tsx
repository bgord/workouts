import * as bg from "@bgord/ui";

const RirOptions = [0, 1, 2, 3];

const segment = { ...bg.Rhythm(26).times(1).width, ...bg.Rhythm(26).times(1).height };

export function RirSegments(props: { field: bg.UseNumberFieldReturnType; disabled?: boolean }) {
  const t = bg.useTranslations();

  const options = [bg.NumberField.EMPTY, ...RirOptions];

  return (
    <fieldset
      aria-label={t("workout.set.rir.label")}
      data-bc="alpha-soft"
      data-br="sm"
      data-bs="solid"
      data-bw="hairline"
      data-md-grow="1"
      data-overflow="hidden"
      data-p="0"
      data-shrink="0"
      data-stack="x"
      data-wrap="nowrap"
      disabled={props.disabled}
      title={t("workout.set.rir.title")}
    >
      {options.map((option, index) => {
        const active = props.field.value === option;

        return (
          <label
            data-bcl={index === 0 ? undefined : "alpha-soft"}
            data-bg={active ? "alpha-medium" : undefined}
            data-bsl={index === 0 ? undefined : "solid"}
            data-bwl={index === 0 ? undefined : "hairline"}
            data-color={
              active ? "neutral-0" : option === bg.NumberField.EMPTY ? "neutral-500" : "neutral-300"
            }
            data-cross="center"
            data-cursor="pointer"
            data-fs="xs"
            data-hover-bg="alpha-subtle"
            data-main="center"
            data-md-grow="1"
            data-position="relative"
            data-stack="x"
            data-transform="font-variant-numeric"
            key={String(option)}
            style={segment}
          >
            <input
              checked={active}
              className="c-visually-hidden"
              name={props.field.input.props.name}
              onChange={() => props.field.set(option)}
              type="radio"
              value={option ?? ""}
            />

            {option ?? t("workout.set.rir.none")}
          </label>
        );
      })}
    </fieldset>
  );
}
