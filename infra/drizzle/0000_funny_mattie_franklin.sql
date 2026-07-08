CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`correlationId` text NOT NULL,
	`createdAt` integer DEFAULT now NOT NULL,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stream_idx` ON `events` (`stream`);--> statement-breakpoint
CREATE UNIQUE INDEX `stream_revision_uidx` ON `events` (`stream`,`revision`);--> statement-breakpoint
CREATE TABLE `facilities` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`creatorId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `facilities_creatorId_idx` ON `facilities` (`creatorId`);--> statement-breakpoint
CREATE TABLE `history` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`subject` text NOT NULL,
	`operation` text NOT NULL,
	`payload` text
);
--> statement-breakpoint
CREATE INDEX `history_subject_createdAt` ON `history` (`subject`,"createdAt" desc);--> statement-breakpoint
CREATE INDEX `history_operation_createdAt` ON `history` (`operation`,"createdAt" desc);--> statement-breakpoint
CREATE INDEX `history_createdAt` ON `history` ("createdAt" desc);--> statement-breakpoint
CREATE TABLE `location_frames` (
	`key` text PRIMARY KEY NOT NULL,
	`locationId` text(36) NOT NULL,
	`facilityId` text(36) NOT NULL,
	`etag` text NOT NULL,
	`capturedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `location_frames_locationId_idx` ON `location_frames` (`locationId`);--> statement-breakpoint
CREATE INDEX `location_frames_locationId_capturedAt_idx` ON `location_frames` (`locationId`,`capturedAt`);--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`facilityId` text(36) NOT NULL,
	`creatorId` text(36) NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`ingestionKeyHash` text(64) NOT NULL,
	`createdAt` integer NOT NULL,
	`frameCaptureIntervalMinutes` integer NOT NULL,
	`frameRetentionDurationDays` integer NOT NULL,
	`lastFrameCapturedAt` integer
);
--> statement-breakpoint
CREATE INDEX `locations_facilityId_idx` ON `locations` (`facilityId`);--> statement-breakpoint
CREATE INDEX `locations_creatorId_idx` ON `locations` (`creatorId`);--> statement-breakpoint
CREATE INDEX `locations_status_idx` ON `locations` (`status`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`preference` text(2) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_preferences_userId_preference_uidx` ON `user_preferences` (`userId`,`preference`);--> statement-breakpoint
CREATE INDEX `user_preferences_userId_idx` ON `user_preferences` (`userId`);--> statement-breakpoint
CREATE INDEX `user_preferences_preference_idx` ON `user_preferences` (`preference`);--> statement-breakpoint
CREATE TABLE `user_profile_avatars` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`userId` text(36) NOT NULL,
	`key` text NOT NULL,
	`etag` text NOT NULL,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_profile_avatars_userId_idx` ON `user_profile_avatars` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_profile_avatars_userId_uniq` ON `user_profile_avatars` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
