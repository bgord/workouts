CREATE TABLE `workouts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`scheduledFor` text NOT NULL,
	`status` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
