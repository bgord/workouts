CREATE TABLE `workoutLoggedSets` (
	`workoutExerciseId` text(36) NOT NULL,
	`setNumber` integer NOT NULL,
	`workoutId` text(36) NOT NULL,
	`reps` integer NOT NULL,
	`load` integer NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`workoutExerciseId`, `setNumber`)
);
