CREATE TABLE `planSections` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`name` text NOT NULL,
	`ownerId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
