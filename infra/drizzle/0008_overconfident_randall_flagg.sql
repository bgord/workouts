CREATE TABLE `bodyWeightMeasurements` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`weight` integer NOT NULL,
	`recordedOn` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyWeightMeasurements_userId_idx` ON `bodyWeightMeasurements` (`userId`);