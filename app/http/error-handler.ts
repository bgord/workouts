import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Exercises from "+exercises";
import * as Plans from "+plans";
import * as Preferences from "+preferences";
import * as Workouts from "+workouts";

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

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy([bg.HttpExceptionErrors]);

const validation = new bg.ErrorClassifierValidationStrategy([
  bg.HashValueError,
  bg.UUIDError,
  tools.ObjectKeyError,
  tools.LanguageError,
  tools.TimestampValueError,
  tools.IntegerPositiveError,
  Exercises.VO.ExerciseNameError,
  Exercises.VO.ExerciseDescriptionError,
  Exercises.VO.ExerciseCategoryNameError,
  Plans.VO.PlanNameError,
  Plans.VO.PlanSectionNameError,
  Plans.VO.RepsError,
]);

const invariants = new bg.ErrorClassifierInvariantStrategy([
  bg.Preferences.Invariants,
  Preferences.Invariants,
  Exercises.Invariants,
  Plans.Invariants,
  Workouts.Invariants,
]);

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler(
      [
        messages,
        http,
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
        new bg.ErrorClassifierWithLoggerStrategy(
          { operation: "domain_error" },
          { inner: invariants, ...deps },
        ),
      ],
      deps,
    ).handle();
}
