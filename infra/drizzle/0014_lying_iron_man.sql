CREATE TABLE `workoutExercises` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`workoutId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`prescriptionSets` integer NOT NULL,
	`prescriptionRepsMin` integer NOT NULL,
	`prescriptionRepsMax` integer NOT NULL,
	`targetSets` integer,
	`targetReps` integer,
	`targetLoad` integer,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
