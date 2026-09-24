import { useRouterState } from "@tanstack/react-router";

export function NavigationProgress() {
  const navigating = useRouterState({
    select: (state) => state.status === "pending" && state.location.href !== state.resolvedLocation?.href,
  });

  if (!navigating) return null;

  return <div aria-hidden className="c-progress-bar" />;
}
