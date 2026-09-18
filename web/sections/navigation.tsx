import * as bg from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { CalendarCheck, Dumbbell, ListChecks, LogOut, Weight } from "lucide-react";
import { Form as BodyWeightMeasurementFilters } from "../../app/services/body-weight-measurement-filters-form";
import { Form as ExerciseCatalogFilters } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";

const link = {
  "data-color": "neutral-300",
  "data-fs": "sm",
  "data-fw": "medium",
  "data-hover-color": "brand-300",
  "data-ls": "wide",
} as const;

export function Navigation() {
  const { width } = bg.useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobileDrawer />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  const t = bg.useTranslations();

  return (
    <nav
      data-bcb="alpha-subtle"
      data-bsb="solid"
      data-bwb="hairline"
      data-position="sticky"
      data-top="0"
      data-z="2"
      style={{
        ...bg.Rhythm(70).times(1).height,
        backdropFilter: "blur(12px)",
        backgroundColor: "color-mix(in oklab, var(--surface-base) 80%, transparent)",
      }}
    >
      <div
        data-cross="center"
        data-height="100%"
        data-maxw="md"
        data-mx="auto"
        data-stack="x"
        data-width="100%"
        {...ui.Spacing.gutter}
        {...ui.Gap.section}
      >
        <ui.Logo search={WorkoutHistoryFilters.default} to="/" />

        <NavigationLink
          activeOptions={{ exact: true }}
          data-ml="auto"
          search={WorkoutHistoryFilters.default}
          to="/"
        >
          {t("app.dashboard")}
        </NavigationLink>

        <NavigationLink search={WorkoutHistoryFilters.default} to="/workouts">
          {t("app.workouts")}
        </NavigationLink>

        <NavigationLink search={ExerciseCatalogFilters.default} to="/catalog">
          {t("app.catalog")}
        </NavigationLink>

        <NavigationLink to="/plans">{t("app.plans")}</NavigationLink>

        <NavigationLink search={BodyWeightMeasurementFilters.default} to="/measurements">
          {t("app.measurements")}
        </NavigationLink>

        <NavigationLink to="/profile">
          <ui.Avatar size={ui.AvatarSize.md} />
        </NavigationLink>

        <NavigationLogout>{t("auth.logout.cta")}</NavigationLogout>
      </div>
    </nav>
  );
}

function NavigationMobileDrawer() {
  const t = bg.useTranslations();

  return (
    <nav
      data-bct="neutral-800"
      data-bg="neutral-950"
      data-bottom="0"
      data-bst="solid"
      data-bwt="hairline"
      data-left="0"
      data-main="between"
      data-position="fixed"
      data-py="4"
      data-right="0"
      data-stack="x"
      data-wrap="nowrap"
      data-z="3"
      {...ui.Spacing.gutter}
    >
      <ui.Logo search={WorkoutHistoryFilters.default} to="/" />

      <NavigationLink search={WorkoutHistoryFilters.default} title={t("app.workouts")} to="/workouts">
        <CalendarCheck data-size="md" />
      </NavigationLink>

      <NavigationLink search={ExerciseCatalogFilters.default} title={t("app.catalog")} to="/catalog">
        <Dumbbell data-size="md" />
      </NavigationLink>

      <NavigationLink title={t("app.plans")} to="/plans">
        <ListChecks data-size="md" />
      </NavigationLink>

      <NavigationLink
        search={BodyWeightMeasurementFilters.default}
        title={t("app.measurements")}
        to="/measurements"
      >
        <Weight data-size="md" />
      </NavigationLink>

      <NavigationLink to="/profile">
        <ui.Avatar size={ui.AvatarSize.sm} />
      </NavigationLink>

      <NavigationLogout>
        <LogOut data-size="md" />
      </NavigationLogout>
    </nav>
  );
}

function NavigationAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return <a data-cross="center" data-main="center" data-stack="x" {...link} {...props} />;
}

const NavigationAnchorLink = createLink(NavigationAnchor);

const NavigationLink: LinkComponent<typeof NavigationAnchor> = (props) => (
  <NavigationAnchorLink
    activeOptions={{ exact: false, includeSearch: false }}
    activeProps={{ "data-color": "brand-300" }}
    {...props}
  />
);

function NavigationShell() {
  return (
    <nav {...bg.Rhythm(70).times(1).style.height}>
      <div
        data-cross="center"
        data-height="100%"
        data-maxw="md"
        data-mx="auto"
        data-stack="x"
        data-width="100%"
        {...ui.Spacing.gutter}
      >
        <ui.Logo search={WorkoutHistoryFilters.default} to="/" />
      </div>
    </nav>
  );
}

function NavigationLogout(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-cursor="pointer"
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      type="button"
      {...link}
      {...props}
    />
  );
}
