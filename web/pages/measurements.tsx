import * as bg from "@bgord/ui";
import { Footprints, Ruler, Scale } from "lucide-react";
import * as ui from "../components";

export function Measurements() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <h1>{t("app.measurements")}</h1>

      <div data-stack="y" {...ui.Gap.related}>
        <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
          <ui.TileLink data-hover-bc="brand-500" to="/measurements/body-weight">
            <div data-stack="y" data-width="100%" {...ui.Gap.inline}>
              <div data-cross="center" data-stack="x" {...ui.Gap.related}>
                <Scale data-color="brand-400" data-size="md" />

                <ui.TileValue>{t("measurements.body_weight.header")}</ui.TileValue>
              </div>

              <small data-color="neutral-500">{t("measurements.body_weight.header.hint")}</small>
            </div>
          </ui.TileLink>

          <ui.TileLink data-hover-bc="brand-500" to="/measurements/body-parts">
            <div data-stack="y" data-width="100%" {...ui.Gap.inline}>
              <div data-cross="center" data-stack="x" {...ui.Gap.related}>
                <Ruler data-color="brand-400" data-size="md" />

                <ui.TileValue>{t("measurements.body_parts.header")}</ui.TileValue>
              </div>

              <small data-color="neutral-500">{t("measurements.body_parts.header.hint")}</small>
            </div>
          </ui.TileLink>
        </ul>

        <ul data-cross="stretch" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
          <ui.TileLink data-hover-bc="brand-500" to="/measurements/daily-steps">
            <div data-stack="y" data-width="100%" {...ui.Gap.inline}>
              <div data-cross="center" data-stack="x" {...ui.Gap.related}>
                <Footprints data-color="brand-400" data-size="md" />

                <ui.TileValue>{t("measurements.daily_steps.header")}</ui.TileValue>
              </div>

              <small data-color="neutral-500">{t("measurements.daily_steps.header.hint")}</small>
            </div>
          </ui.TileLink>

          <li aria-hidden="true" data-grow="1" data-md-disp="none" data-tile="" />
        </ul>
      </div>
    </ui.Main>
  );
}
