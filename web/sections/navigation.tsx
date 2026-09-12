import { useTranslations, useWindowDimensions } from "@bgord/ui";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ClipboardList, Dumbbell, LogOut, Scale, Tags } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { Avatar, AvatarSize, Logo } from "../components";

export function Navigation() {
  const { width } = useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobileDrawer />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  const t = useTranslations();

  return (
    <nav
      data-bcb="alpha-subtle"
      data-bsb="solid"
      data-bwb="hairline"
      data-position="sticky"
      data-top="0"
      data-z="2"
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: "color-mix(in oklab, var(--surface-base) 80%, transparent)",
        height: "70px",
      }}
    >
      <div
        data-cross="center"
        data-gap="6"
        data-height="100%"
        data-maxw="md"
        data-mx="auto"
        data-px="3"
        data-stack="x"
        data-width="100%"
      >
        <Logo />

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

        <NavigationLink search={Form.default} to="/catalog">
          {t("app.catalog")}
        </NavigationLink>

        <NavigationLink to="/plans">{t("app.plans")}</NavigationLink>

        <NavigationLink to="/measurements">{t("app.measurements")}</NavigationLink>

        <NavigationLink to="/profile">
          <Avatar size={AvatarSize.md} />
        </NavigationLink>

        <NavigationLogout>{t("auth.logout.cta")}</NavigationLogout>
      </div>
    </nav>
  );
}

function NavigationMobileDrawer() {
  const t = useTranslations();

  return (
    <nav
      data-bct="neutral-800"
      data-bg="neutral-950"
      data-bottom="0"
      data-bst="solid"
      data-bwt="hairline"
      data-left="0"
      data-main="between"
      data-p="4"
      data-position="fixed"
      data-right="0"
      data-stack="x"
      data-wrap="nowrap"
      data-z="3"
    >
      <Logo />

      <NavigationLink search={WorkoutHistoryFilters.default} title={t("app.workouts")} to="/workouts">
        <Dumbbell data-size="md" />
      </NavigationLink>

      <NavigationLink search={Form.default} title={t("app.catalog")} to="/catalog">
        <Tags data-size="md" />
      </NavigationLink>

      <NavigationLink title={t("app.plans")} to="/plans">
        <ClipboardList data-size="md" />
      </NavigationLink>

      <NavigationLink title={t("app.measurements")} to="/measurements">
        <Scale data-size="md" />
      </NavigationLink>

      <NavigationLink to="/profile">
        <Avatar size={AvatarSize.sm} />
      </NavigationLink>

      <NavigationLogout>
        <LogOut data-size="md" />
      </NavigationLogout>
    </nav>
  );
}

function NavigationAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return (
    <a
      data-color="neutral-300"
      data-cross="center"
      data-fs="sm"
      data-fw="medium"
      data-hover-color="brand-300"
      data-ls="wide"
      data-main="center"
      data-stack="x"
      {...props}
    />
  );
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
    <nav data-cross="center" data-disp="flex" data-p="2" style={{ height: "70px" }}>
      <Logo />
    </nav>
  );
}

function NavigationLogout(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      data-cursor="pointer"
      data-fs="sm"
      data-fw="medium"
      data-hover-color="brand-300"
      data-ls="wide"
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      type="button"
      {...props}
    />
  );
}
