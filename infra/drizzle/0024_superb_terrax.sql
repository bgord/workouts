CREATE TABLE `statsExerciseSets` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`workoutId` text(36) NOT NULL,
	`workoutExerciseId` text(36) NOT NULL,
	`reps` integer NOT NULL,
	`load` integer NOT NULL,
	`loggedAt` integer NOT NULL,
	`completedAt` integer
);
--> statement-breakpoint
CREATE INDEX `statsExerciseSets_userId_exerciseId_idx` ON `statsExerciseSets` (`userId`,`exerciseId`);--> statement-breakpoint
CREATE INDEX `statsExerciseSets_workoutId_idx` ON `statsExerciseSets` (`workoutId`);--> statement-breakpoint
CREATE INDEX `statsExerciseSets_workoutExerciseId_idx` ON `statsExerciseSets` (`workoutExerciseId`);