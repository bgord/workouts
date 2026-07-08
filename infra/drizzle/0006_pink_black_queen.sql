CREATE TABLE `location_alarm_settings` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`facilityId` text(36) NOT NULL,
	`locationId` text(36) NOT NULL,
	`ownerId` text(36) NOT NULL,
	`motionAlarmSimilarityThreshold` integer NOT NULL,
	`motionAlarmEscalationThreshold` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `location_alarm_settings_locationId_idx` ON `location_alarm_settings` (`locationId`);--> statement-breakpoint
CREATE INDEX `location_alarm_settings_facilityId_idx` ON `location_alarm_settings` (`facilityId`);