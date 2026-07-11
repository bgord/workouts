ALTER TABLE `exercise_categories` RENAME COLUMN "capturedAt" TO "createdAt";--> statement-breakpoint
ALTER TABLE `exercises` RENAME COLUMN "capturedAt" TO "createdAt";--> statement-breakpoint
CREATE TABLE `exercise_category_assignments` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`exerciseCategoryId` text(36) NOT NULL,
	`createdAt` integer NOT NULL
);
