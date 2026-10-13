import * as bg from "@bgord/ui";
import * as ui from "../components";
import { DailyStepsEmpty } from "../sections/daily-steps-empty";
import { DailyStepsExport } from "../sections/daily-steps-export";
import { DailyStepsHistory } from "../sections/daily-steps-history";
import { DailyStepsImport } from "../sections/daily-steps-import";
import { DailyStepsRecord } from "../sections/daily-steps-record";

export function DailySteps() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.ButtonBack to="/measurements" />

        <h1 data-grow="1" data-md-transform="center" data-minw="0">
          {t("measurements.daily_steps.header")}
        </h1>

        <bg.Menu name="daily-steps-menu">
          <ui.MenuTrigger />

          <bg.MenuContent>
            <DailyStepsImport />

            <DailyStepsExport />
          </bg.MenuContent>
        </bg.Menu>
      </div>

      <DailyStepsRecord />

      <DailyStepsEmpty />

      <DailyStepsHistory />
    </ui.Main>
  );
}
