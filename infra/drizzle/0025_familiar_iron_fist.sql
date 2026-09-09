CREATE TABLE `statsExerciseSessions` (
	`userId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`workoutId` text(36) NOT NULL,
	`completedAt` integer NOT NULL,
	`sets` text NOT NULL,
	`volume` integer NOT NULL,
	`oneRepMaxEstimate` integer,
	`oneRepMaxEstimateReps` integer,
	`oneRepMaxEstimateLoad` integer,
	`topSetReps` integer NOT NULL,
	`topSetLoad` integer NOT NULL,
	PRIMARY KEY(`workoutId`, `exerciseId`)
);
--> statement-breakpoint
CREATE INDEX `statsExerciseSessions_history_idx` ON `statsExerciseSessions` (`userId`,`exerciseId`,`completedAt`);--> statement-breakpoint
CREATE INDEX `statsExerciseSessions_estimated_record_idx` ON `statsExerciseSessions` (`userId`,`exerciseId`,`oneRepMaxEstimate`);--> statement-breakpoint
CREATE INDEX `statsExerciseSessions_record_idx` ON `statsExerciseSessions` (`userId`,`exerciseId`,`topSetLoad`,`topSetReps`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_statsExerciseSets` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`workoutId` text(36) NOT NULL,
	`workoutExerciseId` text(36) NOT NULL,
	`reps` integer NOT NULL,
	`load` integer NOT NULL,
	`loggedAt` integer NOT NULL,
	`completedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_statsExerciseSets`("id", "userId", "exerciseId", "workoutId", "workoutExerciseId", "reps", "load", "loggedAt", "completedAt") SELECT "id", "userId", "exerciseId", "workoutId", "workoutExerciseId", "reps", "load", "loggedAt", "completedAt" FROM `statsExerciseSets`;--> statement-breakpoint
DROP TABLE `statsExerciseSets`;--> statement-breakpoint
ALTER TABLE `__new_statsExerciseSets` RENAME TO `statsExerciseSets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `statsExerciseSets_userId_exerciseId_idx` ON `statsExerciseSets` (`userId`,`exerciseId`);--> statement-breakpoint
CREATE INDEX `statsExerciseSets_workoutId_idx` ON `statsExerciseSets` (`workoutId`);--> statement-breakpoint
CREATE INDEX `statsExerciseSets_workoutExerciseId_idx` ON `statsExerciseSets` (`workoutExerciseId`);