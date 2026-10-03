CREATE INDEX `exercise_category_assignments_exerciseCategoryId_idx` ON `exercise_category_assignments` (`exerciseCategoryId`);--> statement-breakpoint
CREATE INDEX `planSectionExerciseInstructions_planSectionId_idx` ON `planSectionExerciseInstructions` (`planSectionId`);--> statement-breakpoint
CREATE INDEX `planSectionExerciseInstructions_exerciseId_idx` ON `planSectionExerciseInstructions` (`exerciseId`);--> statement-breakpoint
CREATE INDEX `planSections_planId_idx` ON `planSections` (`planId`);--> statement-breakpoint
CREATE INDEX `workoutExercises_workoutId_idx` ON `workoutExercises` (`workoutId`);--> statement-breakpoint
CREATE INDEX `workoutLoggedSets_workoutId_idx` ON `workoutLoggedSets` (`workoutId`);