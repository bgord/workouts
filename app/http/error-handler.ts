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
  [tools.RevisionError.Mismatch]: { message: "revision.mismatch", status: 412 },
});

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy([bg.HttpExceptionErrors]);

const validation = new bg.ErrorClassifierValidationStrategy([
  Exercises.VO.ExerciseCategoryNameError,
  Exercises.VO.ExerciseDescriptionError,
  Exercises.VO.ExerciseNameError,
  Plans.VO.PlanNameError,
  Plans.VO.PlanSectionNameError,
  Plans.VO.RepsError,
  Workouts.VO.WorkoutNoteError,
  bg.HashValueError,
  bg.UUIDError,
  tools.DayIsoIdError,
  tools.IntegerPositiveError,
  tools.LanguageError,
  tools.ObjectKeyError,
  tools.TimestampValueError,
  tools.WeightGramsError,
]);

const invariants = new bg.ErrorClassifierInvariantStrategy([
  Exercises.Invariants,
  Plans.Invariants,
  Preferences.Invariants,
  Workouts.Invariants,
  bg.Preferences.Invariants,
]);

export class ErrorHandler {
  static handle: (deps: Dependencies) => hono.ErrorHandler = (deps) =>
    new bg.ErrorHonoHandler(
      [
        messages,
        http,
        // Stryker disable next-line StringLiteral
        new bg.ErrorClassifierWithLoggerStrategy({ operation: "validation" }, { inner: validation, ...deps }),
        new bg.ErrorClassifierWithLoggerStrategy(
          // Stryker disable next-line StringLiteral
          { operation: "domain_error" },
          { inner: invariants, ...deps },
        ),
      ],
      deps,
    ).handle();
}
