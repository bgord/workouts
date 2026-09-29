import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { useRef } from "react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";
import { BodyPartMeasureRow } from "./body-part-measure-row";

export function BodyPartMeasure() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  const bodyPartMeasure = bg.useToggle({ name: "body-part-measure" });

  const today = DateFormat.todayISO();

  const measuredOn = bg.useDateField({ name: "body-part-measured-on", defaultValue: today });
  const form = useRef<HTMLFormElement>(null);

  const mutation = bg.useMutation({
    perform: () => {
      const values = new FormData(form.current ?? undefined);

      const measurements = bodyParts.data.flatMap((bodyPart) => {
        const [latest] = bodyPart.measurements;
        const value = LengthFormat.parse(String(values.get(bodyPart.id)));

        return value && value !== latest?.value ? [{ bodyPartId: bodyPart.id, value }] : [];
      });

      return fetch("/api/measurements/body-part/measure", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ measuredOn: measuredOn.value, measurements }),
      });
    },
    onSuccess: async () => {
      bodyPartMeasure.disable();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  if (!bodyParts.actions.measure.available) return null;

  return (
    <>
      <button
        className="c-button"
        data-md-grow="1"
        data-variant="primary"
        disabled={!bodyParts.actions.measure.enabled}
        onClick={bodyPartMeasure.enable}
        type="button"
        {...bodyPartMeasure.props.controller}
      >
        <Plus data-size="sm" />
        {t("measurements.body_parts.measure.header")}
      </button>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...bodyPartMeasure}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bodyPartMeasure.disable}>
          {t("measurements.body_parts.measure.header")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-minh="0"
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          ref={form}
          {...ui.Gap.related}
        >
          <div data-stack="y" {...ui.Gap.field}>
            <label {...measuredOn.label.props}>{t("measurements.body_parts.measure.date.label")}</label>

            <input
              className="c-input"
              data-md-width="100%"
              data-self="start"
              data-width="auto"
              disabled={mutation.isLoading}
              type="date"
              {...measuredOn.input.props}
              max={today}
            />
          </div>

          <ul data-md-minh="unset" data-minh="0" data-overflow="auto" data-stack="y">
            {bodyParts.data.map((bodyPart, index) => (
              <BodyPartMeasureRow
                disabled={mutation.isLoading}
                first={index === 0}
                key={bodyPart.id}
                {...bodyPart}
              />
            ))}
          </ul>

          {mutation.isError && <ui.DialogError>{t("measurements.body_parts.measure.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={bodyPartMeasure.disable}>
            <button
              className="c-button"
              data-variant="primary"
              disabled={!measuredOn.value || mutation.isLoading}
              type="submit"
            >
              <Check data-size="sm" />
              {t("measurements.body_parts.measure.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
