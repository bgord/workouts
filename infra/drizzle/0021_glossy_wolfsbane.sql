ALTER TABLE `exercises` ADD `loadStep` text DEFAULT 'kg_2_5' NOT NULL;--> statement-breakpoint
UPDATE `exercises` SET `loadStep` = 'none' WHERE `resistance` = 'bodyweight';