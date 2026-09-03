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
import { Avatar, Exercises, I18N, Plans, Session } from "./api";
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
  loader: async ({ context, params }) => ({ plan: await Plans.get(context.request, params) }),
});
const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
});

const routeTree = rootRoute.addChildren([homeRoute, workbookRoute, exerciseRoute, plansRoute, profileRoute]);

export function createRouter(context: RouterContext) {
  return new Router({
    routeTree,
    context,
    planRoute,
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
