CREATE TABLE `bodyPartMeasurements` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`bodyPartId` text(36) NOT NULL,
	`userId` text(36) NOT NULL,
	`valueMm` integer NOT NULL,
	`measuredOn` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyPartMeasurements_userId_bodyPartId_measuredOn_idx` ON `bodyPartMeasurements` (`userId`,`bodyPartId`,`measuredOn`);--> statement-breakpoint
CREATE UNIQUE INDEX `bodyPartMeasurements_userId_bodyPartId_measuredOn_uidx` ON `bodyPartMeasurements` (`userId`,`bodyPartId`,`measuredOn`);--> statement-breakpoint
CREATE TABLE `bodyParts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`name` text NOT NULL,
	`normalizedName` text NOT NULL,
	`archived` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyParts_userId_idx` ON `bodyParts` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `bodyParts_userId_normalizedName_uidx` ON `bodyParts` (`userId`,`normalizedName`) WHERE "bodyParts"."archived" = 0;