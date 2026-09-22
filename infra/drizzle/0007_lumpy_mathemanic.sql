CREATE TABLE `weeklySummaries` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`weekIsoId` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weeklySummaries_userId_weekIsoId_uidx` ON `weeklySummaries` (`userId`,`weekIsoId`);