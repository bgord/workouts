CREATE TABLE `motion_alarms` (
	`id` text PRIMARY KEY NOT NULL,
	`locationId` text(36) NOT NULL,
	`facilityId` text(36) NOT NULL,
	`ownerId` text(36) NOT NULL,
	`trigger_first` text NOT NULL,
	`trigger_second` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_motion_alarms_location_status` ON `motion_alarms` (`locationId`,`status`);