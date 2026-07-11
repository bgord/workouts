CREATE TABLE `exercises` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`capturedAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
