CREATE TABLE `statisticsExerciseOneRepMaxEstimates` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`workoutId` text(36) NOT NULL,
	`estimate` integer NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `statisticsExerciseOneRepMaxEstimates_userId_exerciseId_uidx` ON `statisticsExerciseOneRepMaxEstimates` (`userId`,`exerciseId`);--> statement-breakpoint
CREATE INDEX `statisticsExerciseOneRepMaxEstimates_userId_idx` ON `statisticsExerciseOneRepMaxEstimates` (`userId`);