import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import type * as infra from "+infra";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";

export function createServer({ Env, Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  const WeakETagExtractor = new bg.WeakETagExtractorHonoMiddleware({
    strategy: new bg.WeakETagExtractorHeaderStrategy(),
  });
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "infinite" });
  const CacheResolver = new bg.CacheResolverSimpleStrategy({ CacheRepository });

  const origin = ["http://localhost:3000", "https://workouts.bgord.space"];

  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.SetupHono.essentials(
        {
          csrf: { origin },
          cors: { origin },
          httpLogger: {
            skip: [
              "/api/translations",
              "/api/profile-avatar/get",
              "/api/auth/get-session",
              "/api/digest",
              new URLPattern({ pathname: "/api/facilities/:facilityId/locations/:locationId/frames" }),
              new URLPattern({ pathname: "/api/facilities/:facilityId/locations/:locationId/motion-alarms" }),
            ],
          },
          I18n: { languages, strategies: [new bg.LanguageDetectorCookieStrategy("language")] },
        },
        { ...Adapters.System, ...Tools, CacheResolver },
      ),
      WeakETagExtractor.handle(),
    )
    .use(Tools.ShieldSecurity.handle());

  // Probes =================
  server.get("/liveness", ...new bg.LivenessHonoHandler().handle());
  server.get(
    "/readiness",
    Tools.ShieldTimeout.handle(),
    ...new bg.ReadinessHonoHandler({ prerequisites: Tools.Prerequisites.readiness }).handle(),
  );
  server.get(
    "/healthcheck",
    Tools.ShieldRateLimit.handle(),
    Tools.ShieldTimeout.handle(),
    Tools.ShieldBasicAuth.handle(),
    ...new bg.HealthcheckHonoHandler(
      { Env: Env.type, prerequisites: Tools.Prerequisites.healthcheck },
      { ...Adapters.System, ...Tools, LoggerStatsProvider: Adapters.System.Logger },
    ).handle(),
  );
  // =============================

  //Translations =================
  server.get(
    "/translations",
    Tools.CacheResponse.handle(),
    ...new bg.TranslationsHonoHandler(languages, Tools).handle(),
  );
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.UpdateUserLanguage(deps),
  );
  server.post(
    "/preferences/profile-avatar/update",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    new bg.FileUploaderHonoMiddleware({
      field: "file",
      MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
      maxSize: Preferences.VO.ProfileAvatarMaxSize,
    }).handle(),
    HTTP.Preferences.UpdateProfileAvatar(deps),
  );
  server.get(
    "/profile-avatar/get",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.GetProfileAvatar(Adapters.System),
  );
  server.delete(
    "/preferences/profile-avatar",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    HTTP.Preferences.RemoveProfileAvatar(deps),
  );
  // =============================

  // Auth ========================
  server.on(["POST", "GET"], "/auth/*", async (c) => {
    const response = await Tools.Auth.config.handler(c.req.raw);

    if (
      c.req.method === "POST" &&
      c.req.path === "/api/auth/sign-out" &&
      [200, 302].includes(response.status)
    ) {
      return c.redirect("/public/login.html");
    }

    return response;
  });
  // =============================

  server.onError(HTTP.ErrorHandler.handle(Adapters.System));

  return server;
}
