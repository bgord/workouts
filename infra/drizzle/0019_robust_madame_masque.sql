PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workoutLoggedSets` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`workoutExerciseId` text(36) NOT NULL,
	`setNumber` integer NOT NULL,
	`workoutId` text(36) NOT NULL,
	`reps` integer NOT NULL,
	`load` integer NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `workoutLoggedSets`;--> statement-breakpoint
ALTER TABLE `__new_workoutLoggedSets` RENAME TO `workoutLoggedSets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `workoutLoggedSets_workoutExerciseId_idx` ON `workoutLoggedSets` (`workoutExerciseId`);