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
import { PlanStatusEnum } from "../modules/plans/value-objects/plan-status";
import { Avatar, Exercises, I18N, Plans, Session, Workouts } from "./api";
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

// fallow-ignore-file unused-export
export const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/home"), "Home"),
  loader: async ({ context }) => {
    const plans = await Plans.list(context.request);
    const finalized = plans.find((plan) => plan.status === PlanStatusEnum.finalized);

    return {
      workouts: await Workouts.list(context.request),
      plan: finalized ? await Plans.get(context.request, { planId: finalized.id }) : null,
    };
  },
});

export const workbookRoute = createRoute({
  path: "/workbook",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/workbook"), "Workbook"),
  validateSearch: (value) => ({
    category:
      typeof value["category"] === "string"
        ? value["category"]
        : ExerciseCatalogFiltersForm.Form.default.category,
    name: typeof value["name"] === "string" ? value["name"] : ExerciseCatalogFiltersForm.Form.default.name,
  }),
  loader: async ({ context }) => ({
    exercises: await Exercises.list(context.request),
    exerciseCategories: await Exercises.listCategories(context.request),
  }),
});

export const exerciseRoute = createRoute({
  path: "/workbook/exercise/$exerciseId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/exercise"), "Exercise"),
  loader: async ({ context, params }) => ({ exercise: await Exercises.get(context.request, params) }),
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
  loader: async ({ context, params }) => ({
    workout: await Workouts.get(context.request, params),
    workouts: await Workouts.list(context.request),
  }),
});

const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  workbookRoute,
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
    ssr: { nonce: context.nonce },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
