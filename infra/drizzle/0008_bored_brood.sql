ALTER TABLE `planSectionExerciseInstructions` RENAME COLUMN "reps" TO "repsMin";--> statement-breakpoint
ALTER TABLE `planSectionExerciseInstructions` ADD `repsMax` integer NOT NULL;