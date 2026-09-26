CREATE TABLE `bodyPartMeasurements` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`bodyPartId` text(36) NOT NULL,
	`value` integer NOT NULL,
	`measuredOn` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyPartMeasurements_userId_idx` ON `bodyPartMeasurements` (`userId`);--> statement-breakpoint
CREATE INDEX `bodyPartMeasurements_bodyPartId_idx` ON `bodyPartMeasurements` (`bodyPartId`);--> statement-breakpoint
CREATE TABLE `bodyParts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyParts_userId_idx` ON `bodyParts` (`userId`);