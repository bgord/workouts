// fallow-ignore-file circular-dependencies
import * as bg from "@bgord/ui";
import { createRootRouteWithContext, createRoute, notFound, Router, redirect } from "@tanstack/react-router";
import * as BodyWeightChartForm from "../app/services/body-weight-chart-form";
import * as BodyWeightMeasurementFiltersForm from "../app/services/body-weight-measurement-filters-form";
import * as ExerciseCatalogFiltersForm from "../app/services/exercise-catalog-filters-form";
import * as WorkoutHistoryFiltersForm from "../app/services/workout-history-filters-form";
import { BodyWeightChartGranularityOptions } from "../modules/measurements/value-objects/body-weight-chart-granularity-options";
import {
  Avatar,
  Dashboard,
  Exercises,
  I18N,
  Measurements,
  Plans,
  Preferences,
  Session,
  Statistics,
  Workouts,
} from "./api";
import { NotFound } from "./not-found";
import { Catalog as CatalogPage } from "./pages/catalog";
import { Dashboard as DashboardPage } from "./pages/dashboard";
import { Exercise as ExercisePage } from "./pages/exercise";
import { Measurements as MeasurementsPage } from "./pages/measurements";
import { Plan as PlanPage } from "./pages/plan";
import { Plans as PlansPage } from "./pages/plans";
import { Profile as ProfilePage } from "./pages/profile";
import { Workout as WorkoutPage } from "./pages/workout";
import { Workouts as WorkoutsPage } from "./pages/workouts";
import { ExerciseNotFound } from "./sections/exercise-not-found";
import { PlanNotFound } from "./sections/plan-not-found";
import { WorkoutNotFound } from "./sections/workout-not-found";
import { Shell } from "./shell";

type RouterContext = { request: Request | null; nonce: string; assetVersion: string };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: ({ match }: { match: { context: RouterContext } }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "color-scheme", content: "dark" },
      { title: "Workouts" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Workouts" },
    ],
    links: [
      { rel: "apple-touch-icon", href: "/public/apple-touch-icon.png" },
      ...bg.CSS(bg.AssetVersion.url("/public/main.min.css", match.context.assetVersion)),
      ...bg.CSS(bg.AssetVersion.url("/public/custom.css", match.context.assetVersion)),
    ],
    scripts: [bg.JS(bg.AssetVersion.url("/public/entry-client.js", match.context.assetVersion))],
  }),
  component: Shell,
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    const [session, i18n, avatarEtag] = await Promise.all([
      Session.get(context.request),
      I18N.get(context.request),
      Avatar.getEtag(context.request),
    ]);

    if (!(session && i18n)) throw redirect({ href: "/public/login.html", reloadDocument: true });

    return { session, i18n, avatarEtag };
  },
  notFoundComponent: NotFound,
});

export const dashboardRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: DashboardPage,
  loader: async ({ context }) => {
    const { workouts, bodyWeightStats } = await Dashboard.get(context.request);

    return { dashboard: workouts, bodyWeightStats };
  },
});

export const workoutsRoute = createRoute({
  path: "/workouts",
  getParentRoute: () => rootRoute,
  component: WorkoutsPage,
  validateSearch: WorkoutHistoryFiltersForm.Form.validate,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    return { workouts: await Workouts.list(context.request, deps) };
  },
});

export const catalogRoute = createRoute({
  path: "/catalog",
  getParentRoute: () => rootRoute,
  component: CatalogPage,
  validateSearch: ExerciseCatalogFiltersForm.Form.validate,
  loader: async ({ context }) => {
    const [exercises, exerciseCategories] = await Promise.all([
      Exercises.list(context.request),
      Exercises.listCategories(context.request),
    ]);

    return { exercises, exerciseCategories };
  },
});

export const exerciseRoute = createRoute({
  path: "/catalog/exercise/$exerciseId",
  getParentRoute: () => rootRoute,
  component: ExercisePage,
  notFoundComponent: ExerciseNotFound,
  loader: async ({ context, params }) => {
    const [exercise, performances] = await Promise.all([
      Exercises.get(context.request, params),
      Statistics.getExercisePerformances(context.request, params),
    ]);

    if (!exercise) throw notFound();

    return { exercise, performances };
  },
});

export const plansRoute = createRoute({
  path: "/plans",
  getParentRoute: () => rootRoute,
  component: PlansPage,
  loader: async ({ context }) => ({ plans: await Plans.list(context.request) }),
});

export const planRoute = createRoute({
  path: "/plans/$planId",
  getParentRoute: () => rootRoute,
  component: PlanPage,
  notFoundComponent: PlanNotFound,
  loader: async ({ context, params }) => {
    const plan = await Plans.get(context.request, params);

    if (!plan) throw notFound();

    return { plan };
  },
});

export const workoutRoute = createRoute({
  path: "/workouts/$workoutId",
  getParentRoute: () => rootRoute,
  component: WorkoutPage,
  validateSearch: WorkoutHistoryFiltersForm.Form.validate,
  notFoundComponent: WorkoutNotFound,
  loader: async ({ context, params }) => {
    const workout = await Workouts.get(context.request, params);

    if (!workout) throw notFound();

    return { workout };
  },
});

export const measurementsRoute = createRoute({
  path: "/measurements",
  getParentRoute: () => rootRoute,
  component: MeasurementsPage,
  validateSearch: (value: Record<string, unknown>) => ({
    ...BodyWeightMeasurementFiltersForm.Form.validate(value),
    ...BodyWeightChartForm.Form.validate(value),
  }),
  loaderDeps: ({ search }) => ({ month: search.month, chart: search.chart }),
  loader: async ({ context, deps }) => {
    const [{ month, measurements, previous, months, stats }, { points }] = await Promise.all([
      Measurements.listBodyWeight(context.request, { month: deps.month }),
      Measurements.bodyWeightChart(context.request, {
        granularity: deps.chart ?? BodyWeightChartGranularityOptions.weekly,
      }),
    ]);

    return { month, measurements, previous, months, bodyWeightStats: stats, chart: points };
  },
});

export const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: ProfilePage,
  loader: async ({ context }) => {
    const { weeklySummary } = await Preferences.getWeeklySummary(context.request);

    return { weeklySummary };
  },
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  workoutsRoute,
  catalogRoute,
  exerciseRoute,
  plansRoute,
  planRoute,
  workoutRoute,
  measurementsRoute,
  profileRoute,
]);

export function createRouter(context: RouterContext) {
  return new Router({
    routeTree,
    context,
    defaultPreload: "intent",
    defaultViewTransition: true,
    scrollRestoration: true,
    ssr: { nonce: context.nonce },
    dehydrate: () => ({ assetVersion: context.assetVersion }),
    hydrate: (dehydrated) => {
      context.assetVersion = dehydrated.assetVersion;
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
