import * as bg from "@bgord/ui";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { OnlineStatusBar } from "./components/online-status-bar";
import { rootRoute } from "./router";
import { Navigation } from "./sections/navigation";
import { Shortcuts } from "./sections/shortcuts";

export function Shell() {
  const { i18n } = rootRoute.useLoaderData();

  return (
    <html lang={i18n.language}>
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto">
        <div id="root">
          <bg.TranslationsContext.Provider value={i18n}>
            <Navigation />
            <Outlet />
            <Shortcuts />
            <OnlineStatusBar />
          </bg.TranslationsContext.Provider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
