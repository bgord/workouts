// fallow-ignore-file circular-dependencies
import { CSS, JS, META } from "@bgord/ui";
import {
  createRootRouteWithContext,
  createRoute,
  lazyRouteComponent,
  Router,
  redirect,
} from "@tanstack/react-router";
import { Avatar, Exercises, I18N, Session } from "./api";
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
  loader: async ({ context }) => ({ exerciseCategories: await Exercises.listCategories(context.request) }),
});

export const exerciseCategoryRoute = createRoute({
  path: "/workbook/exercise-category/$exerciseCategoryId",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/exercise-category"), "ExerciseCategory"),
  loader: async ({ context, params }) => ({
    exerciseCategory: await Exercises.getCategory(context.request, params),
  }),
});

const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
});

const routeTree = rootRoute.addChildren([homeRoute, workbookRoute, exerciseCategoryRoute, profileRoute]);

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
