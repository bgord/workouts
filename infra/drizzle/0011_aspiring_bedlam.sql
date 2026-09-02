ALTER TABLE `exercise_categories` ADD `userId` text(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `exercises` ADD `userId` text(36) NOT NULL;