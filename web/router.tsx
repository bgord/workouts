// fallow-ignore-file circular-dependencies
import * as bg from "@bgord/ui";
import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  notFound,
  Router,
  redirect,
} from "@tanstack/react-router";
import * as BodyWeightChartForm from "../app/services/body-weight-chart-form";
import * as BodyWeightMeasurementFiltersForm from "../app/services/body-weight-measurement-filters-form";
import * as ExerciseCatalogFiltersForm from "../app/services/exercise-catalog-filters-form";
import * as WorkoutHistoryFiltersForm from "../app/services/workout-history-filters-form";
import type { WebAssetsType } from "../infra/tools/web-assets.vo";
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
import { AssetVersion } from "./services/asset-version";
import { Shell } from "./shell";

type RouterContext = {
  request: Request | null;
  nonce: string;
  build: { sha: string; assets: WebAssetsType };
};

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: ({ match }: { match: { context: RouterContext } }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Workouts" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Workouts" },
    ],
    links: [
      { rel: "apple-touch-icon", href: "/public/apple-touch-icon.png" },
      ...bg.CSS(AssetVersion.url("/public/main.min.css", match.context.build.sha)),
      ...bg.CSS(AssetVersion.url("/public/custom.css", match.context.build.sha)),
    ],
    scripts: [bg.JS("/public/entry-client.js")],
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
  component: lazyRouteComponent(() => import("./pages/dashboard"), "Dashboard"),
  loader: async ({ context }) => {
    const { workouts, bodyWeightStats } = await Dashboard.get(context.request);

    return { dashboard: workouts, bodyWeightStats };
  },
});

export const workoutsRoute = createRoute({
  path: "/workouts",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/workouts"), "Workouts"),
  validateSearch: WorkoutHistoryFiltersForm.Form.validate,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    return { workouts: await Workouts.list(context.request, deps) };
  },
});

export const catalogRoute = createRoute({
  path: "/catalog",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/catalog"), "Catalog"),
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
  component: lazyRouteComponent(() => import("./pages/exercise"), "Exercise"),
  notFoundComponent: lazyRouteComponent(() => import("./sections/exercise-not-found"), "ExerciseNotFound"),
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
  component: lazyRouteComponent(() => import("./pages/plans"), "Plans"),
  loader: async ({ context }) => ({ plans: await Plans.list(context.request) }),
});

export const planRoute = createRoute({
  path: "/plans/$planId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/plan"), "Plan"),
  notFoundComponent: lazyRouteComponent(() => import("./sections/plan-not-found"), "PlanNotFound"),
  loader: async ({ context, params }) => {
    const plan = await Plans.get(context.request, params);

    if (!plan) throw notFound();

    return { plan };
  },
});

export const workoutRoute = createRoute({
  path: "/workouts/$workoutId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/workout"), "Workout"),
  validateSearch: WorkoutHistoryFiltersForm.Form.validate,
  notFoundComponent: lazyRouteComponent(() => import("./sections/workout-not-found"), "WorkoutNotFound"),
  loader: async ({ context, params }) => {
    const workout = await Workouts.get(context.request, params);

    if (!workout) throw notFound();

    return { workout };
  },
});

export const measurementsRoute = createRoute({
  path: "/measurements",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/measurements"), "Measurements"),
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
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
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
    dehydrate: () => ({ build: context.build }),
    hydrate: (dehydrated) => {
      context.build = dehydrated.build;
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
