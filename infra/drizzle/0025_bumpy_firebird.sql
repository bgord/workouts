CREATE TABLE `dailyStepsGoals` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`goal` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dailyStepsGoals_userId_uidx` ON `dailyStepsGoals` (`userId`);