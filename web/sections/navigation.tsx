import { useScrollLock, useToggle, useTranslations, useWindowDimensions } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Menu, Xmark } from "iconoir-react";
import { useEffect } from "react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import { Avatar, AvatarSize, Logo } from "../components";

export function Navigation() {
  const { width } = useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  const t = useTranslations();

  return (
    <nav
      className="app-bar"
      data-bcb="neutral-800"
      data-bsb="solid"
      data-bwb="hairline"
      data-position="sticky"
      data-top="0"
      data-z="2"
      style={{ height: "70px" }}
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

        <Link
          data-color="neutral-300"
          data-focus-ring="neutral"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-ls="wide"
          data-ml="auto"
          search={WorkoutHistoryFilters.default}
          to="/"
        >
          {t("app.workouts")}
        </Link>

        <Link
          data-color="neutral-300"
          data-focus-ring="neutral"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-ls="wide"
          search={Form.default}
          to="/catalog"
        >
          {t("app.catalog")}
        </Link>

        <Link
          data-color="neutral-300"
          data-focus-ring="neutral"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-ls="wide"
          to="/plans"
        >
          {t("app.plans")}
        </Link>

        <Link
          data-color="neutral-300"
          data-focus-ring="neutral"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-ls="wide"
          to="/profile"
        >
          <Avatar size={AvatarSize.md} />
        </Link>

        <NavigationLogout
          data-color="neutral-300"
          data-focus-ring="neutral"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-ls="wide"
        />
      </div>
    </nav>
  );
}

function NavigationMobile() {
  const navigation = useToggle({ name: "navigation" });
  const t = useTranslations();

  useScrollLock(navigation.on);

  useEffect(() => {
    if (navigation.off) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigation.disable();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navigation.off, navigation.disable]);

  return (
    <>
      <nav
        className="app-bar"
        data-cross="center"
        data-disp="flex"
        data-bcb="neutral-800"
        data-bsb="solid"
        data-bwb="hairline"
        data-main="between"
        data-position="sticky"
        data-px="3"
        data-top="0"
        data-z="2"
        style={{ height: "70px" }}
      >
        <Logo />

        <div data-cross="center" data-gap="3" data-stack="x">
          <button
            className="c-button"
            data-variant="bare"
            onClick={navigation.toggle}
            title={t("app.menu.show")}
            type="button"
            {...navigation.props.controller}
          >
            <Menu data-color="white" height="24" width="24" />
          </button>
        </div>
      </nav>

      {navigation.on && (
        <nav
          data-bg="neutral-950"
          data-dir="column"
          data-disp="flex"
          data-inset="0"
          data-overflow="auto"
          data-position="fixed"
          data-wrap="nowrap"
          data-z="3"
          {...navigation.props.target}
        >
          <div data-cross="center" data-disp="flex" data-main="between" data-p="2" style={{ height: "70px" }}>
            <Logo />

            <button
              className="c-button"
              data-interaction="subtle-scale"
              data-variant="bare"
              onClick={navigation.disable}
              title={t("app.menu.close")}
              type="button"
              {...navigation.props.controller}
            >
              <Xmark data-color="white" height="24" width="24" />
            </button>
          </div>

          <div
            data-animation="grow-fade-in"
            data-cross="center"
            data-dir="column"
            data-disp="flex"
            data-gap="6"
            data-mt="12"
          >
            <Link data-fs="base" data-fw="medium" onClick={navigation.disable} to="/profile">
              <Avatar size={AvatarSize.sm} />
            </Link>

            <Link
              data-color="neutral-300"
              data-focus-ring="neutral"
              data-fs="sm"
              data-fw="medium"
              data-hover-color="brand-300"
              data-ls="wide"
              data-transform="uppercase"
              onClick={navigation.disable}
              search={WorkoutHistoryFilters.default}
              to="/"
            >
              {t("app.workouts")}
            </Link>

            <Link
              data-color="neutral-300"
              data-focus-ring="neutral"
              data-fs="sm"
              data-fw="medium"
              data-hover-color="brand-300"
              data-ls="wide"
              data-transform="uppercase"
              onClick={navigation.disable}
              search={Form.default}
              to="/catalog"
            >
              {t("app.catalog")}
            </Link>

            <Link
              data-color="neutral-300"
              data-focus-ring="neutral"
              data-fs="sm"
              data-fw="medium"
              data-hover-color="brand-300"
              data-ls="wide"
              data-transform="uppercase"
              onClick={navigation.disable}
              to="/plans"
            >
              {t("app.plans")}
            </Link>

            <Link
              data-color="neutral-300"
              data-focus-ring="neutral"
              data-fs="sm"
              data-fw="medium"
              data-hover-color="brand-300"
              data-ls="wide"
              data-transform="uppercase"
              onClick={navigation.disable}
              to="/profile"
            >
              {t("app.profile")}
            </Link>

            <NavigationLogout
              data-color="neutral-300"
              data-focus-ring="neutral"
              data-fs="sm"
              data-fw="medium"
              data-hover-color="brand-300"
              data-ls="wide"
              data-mt="8"
              data-transform="uppercase"
            />
          </div>
        </nav>
      )}
    </>
  );
}

function NavigationShell() {
  return (
    <nav data-cross="center" data-disp="flex" data-p="2" style={{ height: "70px" }}>
      <Logo />
    </nav>
  );
}

function NavigationLogout(props: React.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  return (
    <button
      data-cursor="pointer"
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      type="button"
      {...props}
    >
      {t("auth.logout.cta")}
    </button>
  );
}
