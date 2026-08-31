import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Exercises from "+exercises";
import * as Plans from "+plans";
import * as Preferences from "+preferences";

type Dependencies = { Logger: bg.LoggerPort };

const messages = new bg.ErrorClassifierMessageMapStrategy({
  [bg.Preferences.CommandHandlers.HandleSetUserLanguageCommandError.Missing]: {
    message: "unsupported.language",
    status: 400,
  },
  [tools.DateRangeError.Invalid]: { message: "invalid.date.range", status: 400 },
  [tools.MimeValueError.Invalid]: { message: "invalid.mime", status: 400 },
  [tools.RevisionError.Mismatch]: { message: "revision.mismatch", status: 412 },
});

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy({
  known: [
    bg.ShieldAuthStrategyError.Rejected,
    bg.ShieldBasicAuthStrategyError.Rejected,
    bg.ShieldCsrfStrategyError.Rejected,
    bg.ShieldRateLimitStrategyError.Rejected,
    bg.ShieldTimeoutStrategyError.Rejected,
    bg.FileUploaderError.MissingFile,
    bg.FileUploaderError.EmptyFile,
    bg.FileUploaderError.InvalidMime,
    bg.FileUploaderError.SizeLimit,
  ],
});

const validation = new bg.ErrorClassifierValidationStrategy({
  validationErrors: [
    bg.HashValueError.InvalidHex,
    bg.HashValueError.Type,
    bg.UUIDError.Type,
    tools.ObjectKeyError.Type,
    tools.LanguageError.Type,
    tools.TimestampValueError.Invalid,
    ...Object.values(tools.IntegerPositiveError),
    ...Object.values(Exercises.VO.ExerciseNameError),
    ...Object.values(Exercises.VO.ExerciseDescriptionError),
    ...Object.values(Exercises.VO.ExerciseCategoryNameError),
    ...Object.values(Plans.VO.PlanNameError),
    ...Object.values(Plans.VO.PlanSectionNameError),
    ...Object.values(Plans.VO.RepsError),
  ],
});

const invariants = new bg.ErrorClassifierInvariantStrategy({
  invariants: Object.values({
    ...bg.Preferences.Invariants,
    ...Preferences.Invariants,
    ...Exercises.Invariants,
    ...Plans.Invariants,
  }),
});

const unknown = new bg.ErrorClassifierUnknownStrategy();

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler({
      classifiers: [
        messages,
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
        new bg.ErrorClassifierWithLoggerStrategy(
          { operation: "domain_error" },
          { inner: invariants, ...deps },
        ),
      ],
      fallback: new bg.ErrorClassifierWithLoggerStrategy(
        { operation: "unknown_error" },
        { inner: unknown, ...deps },
      ),
    }).handle();
}
