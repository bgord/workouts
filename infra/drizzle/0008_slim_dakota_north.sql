PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_planSectionExerciseInstructions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`planSectionId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`sets` integer NOT NULL,
	`repsMin` integer NOT NULL,
	`repsMax` integer NOT NULL,
	`reps` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`progression` text DEFAULT 'double_progression' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_planSectionExerciseInstructions`("id", "planId", "planSectionId", "exerciseId", "sets", "repsMin", "repsMax", "reps", "userId", "createdAt", "updatedAt", "position", "progression") SELECT "id", "planId", "planSectionId", "exerciseId", "sets", "repsMin", "repsMax", json_object('min', "repsMin", 'max', "repsMax"), "userId", "createdAt", "updatedAt", "position", "progression" FROM `planSectionExerciseInstructions`;--> statement-breakpoint
DROP TABLE `planSectionExerciseInstructions`;--> statement-breakpoint
ALTER TABLE `__new_planSectionExerciseInstructions` RENAME TO `planSectionExerciseInstructions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
