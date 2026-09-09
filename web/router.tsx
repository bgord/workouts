// fallow-ignore-file circular-dependencies
import { CSS, JS, META } from "@bgord/ui";
import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Router,
  redirect,
} from "@tanstack/react-router";
import * as ExerciseCatalogFiltersForm from "../app/services/exercise-catalog-filters-form";
import * as WorkoutHistoryFiltersForm from "../app/services/workout-history-filters-form";
import { PlanStatusEnum } from "../modules/plans/value-objects/plan-status";
import { Avatar, Exercises, I18N, Plans, Session, Statistics, Workouts } from "./api";
import { NotFound } from "./not-found";
import { Shell } from "./shell";

type RouterContext = { request: Request | null; nonce: string };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [...META, { title: "Workouts" }],
    links: [...CSS("/public/main.min.css"), ...CSS("/public/custom.css")],
    scripts: [JS("/public/entry-client.js")],
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
  }),
  loader: async ({ context }) => {
    const plans = await Plans.list(context.request);
    const finalized = plans.data.active.find((plan) => plan.status === PlanStatusEnum.finalized);
    const plan = finalized ? await Plans.get(context.request, { planId: finalized.id }) : null;

    return { workouts: await Workouts.list(context.request), plan: plan?.data ?? null };
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
  loader: async ({ context, params }) => ({
    exercise: await Exercises.get(context.request, params),
    performances: await Statistics.getExercisePerformances(context.request, params),
  }),
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
  loader: async ({ context, params }) => ({
    plan: await Plans.get(context.request, params),
    exercises: await Exercises.list(context.request),
  }),
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
  }),
  loader: async ({ context, params }) => ({
    workout: await Workouts.get(context.request, params),
    exercises: await Exercises.list(context.request),
  }),
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
