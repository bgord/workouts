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
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `bodyWeightMeasurements` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`weight` integer NOT NULL,
	`measuredOn` text NOT NULL,
	`reference` integer DEFAULT false NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bodyWeightMeasurements_userId_idx` ON `bodyWeightMeasurements` (`userId`);--> statement-breakpoint
CREATE TABLE `events` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`correlationId` text NOT NULL,
	`createdAt` integer DEFAULT now NOT NULL,
	`name` text NOT NULL,
	`stream` text NOT NULL,
	`version` integer NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`commit` text NOT NULL,
	`payload` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `stream_idx` ON `events` (`stream`);--> statement-breakpoint
CREATE UNIQUE INDEX `stream_revision_uidx` ON `events` (`stream`,`revision`);--> statement-breakpoint
CREATE TABLE `exercise_categories` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_category_assignments` (
	`exerciseId` text(36) NOT NULL,
	`exerciseCategoryId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`exerciseId`, `exerciseCategoryId`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`image` text NOT NULL,
	`imageEtag` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `planSectionExerciseInstructions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`planSectionId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`sets` integer NOT NULL,
	`repsMin` integer NOT NULL,
	`repsMax` integer NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `planSections` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`name` text NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`kind` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `workoutExercises` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`workoutId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`exerciseName` text NOT NULL,
	`exerciseImageEtag` text NOT NULL,
	`exerciseDescription` text NOT NULL,
	`prescriptionSets` integer NOT NULL,
	`prescriptionRepsMin` integer NOT NULL,
	`prescriptionRepsMax` integer NOT NULL,
	`targetSets` integer,
	`targetReps` integer,
	`targetLoad` integer,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workoutLoggedSets` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`workoutExerciseId` text(36) NOT NULL,
	`setNumber` integer NOT NULL,
	`workoutId` text(36) NOT NULL,
	`reps` integer NOT NULL,
	`load` integer NOT NULL,
	`rir` integer,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `workoutLoggedSets_workoutExerciseId_idx` ON `workoutLoggedSets` (`workoutExerciseId`);--> statement-breakpoint
CREATE INDEX `workoutLoggedSets_userId_idx` ON `workoutLoggedSets` (`userId`);--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`planId` text(36) NOT NULL,
	`planName` text NOT NULL,
	`planSectionId` text(36) NOT NULL,
	`planSectionName` text NOT NULL,
	`scheduledFor` text NOT NULL,
	`status` text NOT NULL,
	`completedAt` integer,
	`note` text,
	`revision` integer DEFAULT 0 NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
