import * as bg from "@bgord/ui";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { NavigationProgress } from "./components/navigation-progress";
import { OnlineStatusBar } from "./components/online-status-bar";
import { TimeZoneContext } from "./hooks/use-time-zone";
import { rootRoute } from "./router";
import { Navigation } from "./sections/navigation";
import { Shortcuts } from "./sections/shortcuts";

export function Shell() {
  const { i18n, timeZone } = rootRoute.useLoaderData();

  return (
    <html lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto">
        <div id="root">
          <bg.TranslationsContext.Provider value={i18n}>
            <TimeZoneContext.Provider value={timeZone}>
              <NavigationProgress />
              <Navigation />
              <Outlet />
              <Shortcuts />
              <OnlineStatusBar />
            </TimeZoneContext.Provider>
          </bg.TranslationsContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
