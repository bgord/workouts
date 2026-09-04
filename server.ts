import * as bg from "@bgord/bun";
import { Hono } from "hono";
import { HTTP } from "+app";
import * as Exercises from "+exercises";
import type * as infra from "+infra";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import { host, localhost } from "+infra/config";

export function createServer({ Env, Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  const WeakETagExtractor = new bg.WeakETagExtractorHonoMiddleware({
    strategy: new bg.WeakETagExtractorHeaderStrategy(),
  });
  const CacheRepository = new bg.CacheRepositoryNodeCacheAdapter({ type: "infinite" });
  const CacheResolver = new bg.CacheResolverReadThroughStrategy({ CacheRepository });

  const redactor = new bg.RedactorMask(bg.RedactorMask.DEFAULT_KEYS);

  const origin = [localhost, host];

  const server = new Hono<infra.Config>()
    .basePath("/api")
    .use(
      ...bg.SetupHono.essentials(
        {
          csrf: { origin },
          cors: { origin },
          httpLogger: { skip: ["/api/translations", "/api/profile-avatar/get", "/api/auth/get-session"] },
          I18n: { languages, strategies: [new bg.LanguageDetectorCookieStrategy("language")] },
        },
        { ...Adapters.System, ...Tools, CacheResolver },
      ),
      WeakETagExtractor.handle(),
    )
    .use(Tools.ShieldSecurity.handle());

  // Exercises =============
  const exercises = new Hono<infra.Config>();

  exercises.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  exercises.get("/list", bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseList(Adapters.Exercises)));
  exercises.query("/search", bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseSearch(Adapters.Exercises)));
  exercises.post(
    "/add",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    new bg.FileUploaderHonoMiddleware(
      {
        field: "file",
        maxSize: Exercises.VO.ExerciseImageMaxSize,
        MimeRegistry: Exercises.VO.ExerciseImageMimeRegistry,
      },
      { FileTypeDetector: new bg.FileTypeDetectorMagicBytesStrategy() },
    ).handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseAdd(deps)),
  );
  exercises.get("/:exerciseId", bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseGet(Adapters.Exercises)));
  exercises.delete(
    "/:exerciseId",
    Tools.ShieldCaptcha.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseDelete(deps)),
  );
  exercises.patch(
    "/:exerciseId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseUpdate(deps)),
  );
  exercises.patch(
    "/:exerciseId/image",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    new bg.FileUploaderHonoMiddleware(
      {
        field: "file",
        maxSize: Exercises.VO.ExerciseImageMaxSize,
        MimeRegistry: Exercises.VO.ExerciseImageMimeRegistry,
      },
      { FileTypeDetector: new bg.FileTypeDetectorMagicBytesStrategy() },
    ).handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseImageChange(deps)),
  );
  exercises.get("/:exerciseId/image", bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseImageGet(deps)));

  exercises.get(
    "/category/list",
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseCategoryList(Adapters.Exercises)),
  );
  exercises.query(
    "/category/search",
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseCategorySearch(Adapters.Exercises)),
  );
  exercises.post(
    "/category",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseCategoryAdd(deps)),
  );
  exercises.patch(
    "/category/:exerciseCategoryId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseCategoryRename(deps)),
  );
  exercises.delete(
    "/category/:exerciseCategoryId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseCategoryDelete(deps)),
  );
  exercises.post(
    "/category/assign",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseAssignCategory(deps)),
  );
  exercises.post(
    "/category/unassign",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Exercises.ExerciseUnassignCategory(deps)),
  );

  server.route("/exercises", exercises);

  // Plans =================
  const plans = new Hono<infra.Config>();

  plans.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  plans.get("/list", bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanList(Adapters.Plans)));
  plans.get("/:planId", bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanGet(Adapters.Plans)));
  plans.post(
    "/create",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanCreate(deps)),
  );
  plans.post(
    "/:planId/section",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionCreate(deps)),
  );
  plans.post(
    "/:planId/section/:planSectionId/rename",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionRename(deps)),
  );
  plans.delete(
    "/:planId/section/:planSectionId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionRemove(deps)),
  );
  plans.post(
    "/:planId/section/:planSectionId/exercise-instruction",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionExerciseInstructionAdd(deps)),
  );
  plans.patch(
    "/:planId/section/:planSectionId/exercise-instruction/:exerciseInstructionId/instruction",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionExerciseInstructionUpdate(deps)),
  );
  plans.patch(
    "/:planId/section/:planSectionId/exercise-instruction/:exerciseInstructionId/exercise",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionExerciseInstructionExerciseChange(deps)),
  );
  plans.delete(
    "/:planId/section/:planSectionId/exercise-instruction/:exerciseInstructionId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanSectionExerciseInstructionRemove(deps)),
  );
  plans.post(
    "/:planId/archive",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanArchive(deps)),
  );
  plans.post(
    "/:planId/finalize",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanFinalize(deps)),
  );
  plans.post(
    "/:planId/restore",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanRestore(deps)),
  );
  plans.delete(
    "/:planId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanRemove(deps)),
  );
  plans.post(
    "/:planId/editing/enable",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanEditingEnable(deps)),
  );
  plans.post(
    "/:planId/rename",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Plans.PlanRename(deps)),
  );

  server.route("/plans", plans);

  // Workouts =================
  const workouts = new Hono<infra.Config>();

  workouts.use("*", Tools.Auth.ShieldAuth.attach, Tools.Auth.ShieldAuth.verify);
  workouts.get("/list", bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutList(Adapters.Workouts)));
  workouts.get("/:workoutId", bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutGet(Adapters.Workouts)));
  workouts.post(
    "/create",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutCreate(deps)),
  );
  workouts.patch(
    "/:workoutId/exercise/:workoutExerciseId/target",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutExerciseSetTarget(deps)),
  );
  workouts.patch(
    "/:workoutId/start",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutStart(deps)),
  );
  workouts.post(
    "/:workoutId/exercise",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutExerciseAdd(deps)),
  );
  workouts.delete(
    "/:workoutId/exercise/:workoutExerciseId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutExerciseRemove(deps)),
  );
  workouts.delete(
    "/:workoutId/exercise/:workoutExerciseId/set/:loggedSetId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutSetRemove(deps)),
  );
  workouts.patch(
    "/:workoutId/exercise/:workoutExerciseId/set/:loggedSetId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutSetCorrect(deps)),
  );
  workouts.post(
    "/:workoutId/exercise/:workoutExerciseId/set",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutSetLog(deps)),
  );
  workouts.patch(
    "/:workoutId/complete",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutComplete(deps)),
  );
  workouts.patch(
    "/:workoutId/abandon",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutAbandon(deps)),
  );
  workouts.delete(
    "/:workoutId",
    Tools.ShieldCaptcha.handle(),
    Tools.ShieldRateLimit.handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Workouts.WorkoutDiscard(deps)),
  );

  server.route("/workouts", workouts);

  // Probes =================
  server.get("/liveness", ...new bg.LivenessHonoHandler().handle());
  server.get(
    "/readiness",
    Tools.ShieldTimeout.handle(),
    ...new bg.ReadinessHonoHandler({ prerequisites: Tools.Prerequisites.readiness, redactor }).handle(),
  );
  server.get(
    "/healthcheck",
    Tools.ShieldRateLimit.handle(),
    Tools.ShieldTimeout.handle(),
    Tools.ShieldBasicAuth.handle(),
    ...new bg.HealthcheckHonoHandler(
      { Env: Env.type, prerequisites: Tools.Prerequisites.healthcheck, redactor },
      { ...Adapters.System, ...Tools, LoggerStatsProvider: Adapters.System.Logger },
    ).handle(),
  );
  // =============================

  //Translations =================
  server.get("/translations", ...new bg.TranslationsHonoHandler(languages, Tools).handle());
  // =============================

  //Preferences =================
  server.post(
    "/preferences/user-language/update",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    bg.EndpointHonoAdapter.adapt(HTTP.Preferences.UpdateUserLanguage(deps)),
  );
  server.post(
    "/preferences/profile-avatar/update",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    new bg.FileUploaderHonoMiddleware(
      {
        field: "file",
        maxSize: Preferences.VO.ProfileAvatarMaxSize,
        MimeRegistry: Preferences.VO.ProfileAvatarMimeRegistry,
      },
      { FileTypeDetector: new bg.FileTypeDetectorMagicBytesStrategy() },
    ).handle(),
    bg.EndpointHonoAdapter.adapt(HTTP.Preferences.UpdateProfileAvatar(deps)),
  );
  server.get(
    "/profile-avatar/get",
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    bg.EndpointHonoAdapter.adapt(HTTP.Preferences.GetProfileAvatar(Adapters.System)),
  );
  server.delete(
    "/preferences/profile-avatar",
    Tools.ShieldCaptcha.handle(),
    Tools.Auth.ShieldAuth.attach,
    Tools.Auth.ShieldAuth.verify,
    bg.EndpointHonoAdapter.adapt(HTTP.Preferences.RemoveProfileAvatar(deps)),
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
