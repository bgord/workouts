ALTER TABLE `planSectionExerciseInstructions` RENAME COLUMN "ownerId" TO "userId";--> statement-breakpoint
ALTER TABLE `planSections` RENAME COLUMN "ownerId" TO "userId";--> statement-breakpoint
ALTER TABLE `plans` RENAME COLUMN "ownerId" TO "userId";