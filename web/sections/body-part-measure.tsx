import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, Ruler } from "lucide-react";
import type { BodyPartSummary } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { LengthFormat } from "../services/length-format";

export function BodyPartMeasure(props: BodyPartSummary) {
  const t = bg.useTranslations();
  const router = useRouter();

  const bodyPartMeasure = bg.useToggle({ name: `body-part-measure-${props.id}` });

  const [latest, previous] = props.measurements;
  const today = bg.useToday();

  const value = bg.useNumberField({
    name: `body-part-measure-value-${props.id}`,
    defaultValue: latest ? LengthFormat.centimeters(latest.value) : undefined,
  });
  const measuredOn = bg.useDateField({
    name: `body-part-measure-measured-on-${props.id}`,
    defaultValue: today.toString(),
  });

  const close = bg.exec([value.clear, measuredOn.clear, bodyPartMeasure.disable]);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/${props.id}/measure`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          value: LengthFormat.millimeters(value.value ?? 0),
          measuredOn: measuredOn.value,
        }),
      }),
    onSuccess: async () => {
      close();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  return (
    <>
      <ui.IconButton
        aria-label={t("measurements.body_parts.measure.header", { name: props.name })}
        onClick={bodyPartMeasure.enable}
        title={t("measurements.body_parts.measure.header", { name: props.name })}
        {...bodyPartMeasure.props.controller}
      >
        <Plus data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...bodyPartMeasure}>
        {bodyPartMeasure.on && (
          <>
            <ui.DialogHeader>
              {t("measurements.body_parts.measure.header", { name: props.name })}
            </ui.DialogHeader>

            <ul data-stack="x">
              <ui.Tile>
                <ui.TileHeader>
                  <Ruler data-size="xs" />
                  {t("measurements.body_parts.measure.previous")}
                </ui.TileHeader>

                <ui.TileValue>
                  {latest ? <ui.LengthValue millimeters={latest.value} /> : "—"}

                  {latest && (
                    <ui.LengthDelta current={latest.value} data-fs="xs" previous={previous?.value} />
                  )}
                </ui.TileValue>

                <ui.TileContext>
                  {latest ? (
                    <bg.DateTime format="freshness" value={latest.measuredOn} />
                  ) : (
                    t("measurements.body_parts.measure.never")
                  )}
                </ui.TileContext>
              </ui.Tile>
            </ul>

            <form
              aria-busy={mutation.isLoading}
              data-stack="y"
              onSubmit={mutation.handleSubmit}
              {...ui.Gap.stack}
            >
              <div
                data-cross="start"
                data-md-cross="stretch"
                data-md-stack="y"
                data-stack="x"
                {...ui.Gap.related}
              >
                <div data-stack="y" {...ui.Gap.field}>
                  <label {...value.label.props}>{t("measurements.body_parts.measure.value.label")}</label>

                  <ui.Stepper
                    aria-label={t("measurements.body_parts.measure.value.label")}
                    disabled={mutation.isLoading}
                    field={value}
                    max={300}
                    min={0.1}
                    step={0.1}
                    unit={t("measurements.body_parts.measure.unit")}
                    width={72}
                  />

                  <small data-color="neutral-600" data-cross="center" data-stack="x" {...ui.Gap.inline}>
                    {t("measurements.body_parts.measure.change")}
                    {latest && value.changed && !value.empty && (
                      <ui.LengthDelta
                        current={LengthFormat.millimeters(value.value ?? 0)}
                        previous={latest.value}
                      />
                    )}
                    {latest && value.unchanged && (
                      <span>
                        <ui.LengthValue millimeters={0} />
                      </span>
                    )}
                    {(!latest || value.empty) && <span>—</span>}
                  </small>
                </div>

                <div data-stack="y" {...ui.Gap.field}>
                  <label {...measuredOn.label.props}>{t("measurements.body_parts.measure.date.label")}</label>

                  <input
                    className="c-input"
                    data-md-width="100%"
                    data-width="auto"
                    disabled={mutation.isLoading}
                    type="date"
                    {...measuredOn.input.props}
                    max={today.toString()}
                  />
                </div>
              </div>

              {mutation.isError && (
                <ui.DialogError>{t("measurements.body_parts.measure.error")}</ui.DialogError>
              )}

              <ui.DialogFooter
                disabled={mutation.isLoading}
                onCancel={bg.exec([mutation.reset, close])}
                start={
                  <ui.ButtonClear
                    disabled={bg.Fields.allUnchanged([value, measuredOn])}
                    onClick={bg.exec([value.clear, measuredOn.clear, mutation.reset])}
                  />
                }
              >
                <button
                  className="c-button"
                  data-variant="primary"
                  disabled={bg.Fields.anyEmpty([value, measuredOn]) || mutation.isLoading}
                  type="submit"
                >
                  <Check data-size="sm" />
                  {t("measurements.body_parts.measure.cta")}
                </button>
              </ui.DialogFooter>
            </form>
          </>
        )}
      </ui.Dialog>
    </>
  );
}
