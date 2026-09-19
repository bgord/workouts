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
import * as BodyWeightMeasurementFiltersForm from "../app/services/body-weight-measurement-filters-form";
import * as ExerciseCatalogFiltersForm from "../app/services/exercise-catalog-filters-form";
import * as WorkoutHistoryFiltersForm from "../app/services/workout-history-filters-form";
import { PlanStatusEnum } from "../modules/plans/value-objects/plan-status";
import { WorkoutListFilterOptions } from "../modules/workouts/value-objects/workout-list-filter-options";
import { Avatar, Exercises, I18N, Measurements, Plans, Session, Statistics, Workouts } from "./api";
import { NotFound } from "./not-found";
import { Shell } from "./shell";

type RouterContext = { request: Request | null; nonce: string };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
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
      ...bg.CSS("/public/main.min.css"),
      ...bg.CSS("/public/custom.css"),
    ],
    scripts: [bg.JS("/public/entry-client.js")],
  }),
  component: Shell,
  staleTime: Number.POSITIVE_INFINITY,
  loader: async ({ context }) => {
    const session = await Session.get(context.request);
    const i18n = await I18N.get(context.request);
    const avatarEtag = await Avatar.getEtag(context.request);

    // @ts-expect-error
    if (!(session && i18n)) throw redirect({ to: "/public/login.html" });

    return { session, i18n, avatarEtag };
  },
  notFoundComponent: NotFound,
});

export const dashboardRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/dashboard"), "Dashboard"),
  loader: async ({ context }) => {
    const { measurements, stats } = await Measurements.listBodyWeight(context.request);

    return { dashboard: await Workouts.dashboard(context.request), measurements, bodyWeightStats: stats };
  },
});

export const workoutsRoute = createRoute({
  path: "/workouts",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/workouts"), "Workouts"),
  validateSearch: (value) => ({
    section:
      typeof value["section"] === "string" && value["section"] !== ""
        ? value["section"]
        : WorkoutHistoryFiltersForm.Form.default.section,
    filter: Object.values(WorkoutListFilterOptions).includes(value["filter"] as WorkoutListFilterOptions)
      ? (value["filter"] as WorkoutListFilterOptions)
      : WorkoutHistoryFiltersForm.Form.default.filter,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const plans = await Plans.list(context.request);
    const finalized = plans.data.active.find((plan) => plan.status === PlanStatusEnum.finalized);
    const plan = finalized ? await Plans.get(context.request, { planId: finalized.id }) : null;

    return {
      workouts: await Workouts.list(context.request, deps),
      plan: plan?.data ?? null,
    };
  },
});

export const catalogRoute = createRoute({
  path: "/catalog",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/catalog"), "Catalog"),
  validateSearch: (value) => ({
    category:
      typeof value["category"] === "string" && value["category"] !== ""
        ? value["category"]
        : ExerciseCatalogFiltersForm.Form.default.category,
    name:
      typeof value["name"] === "string" && value["name"] !== ""
        ? value["name"]
        : ExerciseCatalogFiltersForm.Form.default.name,
  }),
  loader: async ({ context }) => ({
    exercises: await Exercises.list(context.request),
    exerciseCategories: await Exercises.listCategories(context.request),
  }),
});

export const exerciseRoute = createRoute({
  path: "/catalog/exercise/$exerciseId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/exercise"), "Exercise"),
  notFoundComponent: lazyRouteComponent(() => import("./sections/exercise-not-found"), "ExerciseNotFound"),
  loader: async ({ context, params }) => {
    const exercise = await Exercises.get(context.request, params);

    if (!exercise) throw notFound();

    return {
      exercise,
      exerciseCategories: await Exercises.listCategories(context.request),
      performances: await Statistics.getExercisePerformances(context.request, params),
    };
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

    return { plan, exercises: await Exercises.list(context.request) };
  },
});

export const workoutRoute = createRoute({
  path: "/workouts/$workoutId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/workout"), "Workout"),
  validateSearch: (value) => ({
    section:
      typeof value["section"] === "string" && value["section"] !== ""
        ? value["section"]
        : WorkoutHistoryFiltersForm.Form.default.section,
    filter: Object.values(WorkoutListFilterOptions).includes(value["filter"] as WorkoutListFilterOptions)
      ? (value["filter"] as WorkoutListFilterOptions)
      : WorkoutHistoryFiltersForm.Form.default.filter,
  }),
  notFoundComponent: lazyRouteComponent(() => import("./sections/workout-not-found"), "WorkoutNotFound"),
  loader: async ({ context, params }) => {
    const workout = await Workouts.get(context.request, params);

    if (!workout) throw notFound();

    return { workout, exercises: await Exercises.list(context.request) };
  },
});

export const measurementsRoute = createRoute({
  path: "/measurements",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/measurements"), "Measurements"),
  validateSearch: (value) => ({
    month:
      typeof value["month"] === "string" && /^\d{4}-\d{2}$/.test(value["month"])
        ? value["month"]
        : BodyWeightMeasurementFiltersForm.Form.default.month,
  }),
  loader: async ({ context }) => {
    const { measurements, stats } = await Measurements.listBodyWeight(context.request);

    return { measurements, bodyWeightStats: stats };
  },
});

const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
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
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
