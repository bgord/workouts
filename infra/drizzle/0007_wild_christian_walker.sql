CREATE TABLE `planSectionExerciseInstructions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`planSectionId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`ownerId` text(36) NOT NULL,
	`sets` integer NOT NULL,
	`reps` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
