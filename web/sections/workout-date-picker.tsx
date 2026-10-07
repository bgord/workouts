import * as bg from "@bgord/ui";
import { CalendarDays } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";

export function WorkoutDatePicker(props: { field: bg.UseDateFieldReturnType } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { toggle: custom } = bg.extractUseToggle(props);
  const { field } = props;

  const today = DateFormat.todayISO();
  const predefined = Array.from({ length: 3 }, (_, offset) => DateFormat.addDays(today, offset));

  return (
    <div data-stack="y" {...ui.Gap.field}>
      <label {...field.label.props}>{t("workout.create.when.label")}</label>

      <div data-stack="y" {...ui.Gap.cluster}>
        <div data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          {predefined.map((date) => (
            <ui.ChipButton
              key={date}
              onClick={() => {
                custom.disable();
                field.set(date);
              }}
              pressed={custom.off && field.value === date}
            >
              {DateFormat.dayLabel(language, date, today)}
            </ui.ChipButton>
          ))}

          <ui.ChipButton
            onClick={() => {
              /* v8 ignore next */
              if (custom.on) return;
              custom.enable();
              field.set(DateFormat.addDays(today, predefined.length));
            }}
            pressed={custom.on}
            {...custom.props.controller}
          >
            <CalendarDays data-size="xs" />
            {t("workout.create.when.custom")}
          </ui.ChipButton>
        </div>

        {custom.on && (
          <div data-md-self="stretch" data-self="start" data-stack="y" {...custom.props.target}>
            <input
              className="c-input"
              max={DateFormat.addDays(today, WorkoutScheduledForHorizonDaysMax)}
              min={DateFormat.addDays(today, -WorkoutScheduledForHorizonDaysMax)}
              type="date"
              {...field.input.props}
            />
          </div>
        )}
      </div>
    </div>
  );
}
