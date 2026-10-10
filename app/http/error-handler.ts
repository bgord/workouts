import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as Exercises from "+exercises";
import * as Measurements from "+measurements";
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
  [tools.RevisionError.Missing]: { message: "revision.missing", status: 428 },
});

const http = new bg.ErrorClassifierHttpExceptionHonoStrategy([bg.HttpExceptionErrors]);

const validation = new bg.ErrorClassifierValidationStrategy([
  Exercises.VO.ExerciseCategoryNameError,
  Exercises.VO.ExerciseCategoryRoleError,
  Exercises.VO.ExerciseDescriptionError,
  Exercises.VO.ExerciseLateralityError,
  Exercises.VO.ExerciseLoadStepError,
  Exercises.VO.ExerciseResistanceError,
  Exercises.VO.ExerciseNameError,
  Measurements.VO.BodyPartCircumferenceError,
  Measurements.VO.BodyPartDescriptionError,
  Measurements.VO.BodyPartNameError,
  Measurements.VO.BodyWeightChartGranularityError,
  Measurements.VO.BodyWeightError,
  Measurements.VO.BodyWeightGoalError,
  Measurements.VO.BodyWeightHistoryMonthError,
  Plans.VO.PlanDescriptionError,
  Plans.VO.PlanNameError,
  Plans.VO.PlanSectionNameError,
  Plans.VO.PlanSectionWarmupError,
  Plans.VO.PlanSectionCooldownError,
  Plans.VO.RepsRangeError,
  Plans.VO.ProgressionMethodError,
  Plans.VO.RirTargetError,
  Preferences.VO.WeeklySummaryError,
  Workouts.VO.RirError,
  Workouts.VO.WorkoutNoteError,
  Workouts.VO.WorkoutListFilterError,
  bg.HashValueError,
  bg.UUIDError,
  tools.DayIsoIdError,
  tools.ExtensionError,
  tools.HeightMillimetersError,
  tools.IntegerNonNegativeError,
  tools.IntegerPositiveError,
  tools.LanguageError,
  tools.ObjectKeyError,
  tools.TimestampValueError,
  tools.WeightGramsError,
]);

const invariants = new bg.ErrorClassifierInvariantStrategy([
  Measurements.Invariants,
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
