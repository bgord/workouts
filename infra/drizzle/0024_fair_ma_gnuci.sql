CREATE TABLE `dailySteps` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`day` text NOT NULL,
	`count` integer NOT NULL,
	`source` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dailySteps_userId_day_uidx` ON `dailySteps` (`userId`,`day`);