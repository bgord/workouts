PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workoutExercises` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`workoutId` text(36) NOT NULL,
	`exerciseId` text(36) NOT NULL,
	`exerciseName` text NOT NULL,
	`exerciseImageEtag` text NOT NULL,
	`exerciseDescription` text NOT NULL,
	`prescriptionSets` integer NOT NULL,
	`prescriptionRepsMin` integer NOT NULL,
	`prescriptionRepsMax` integer NOT NULL,
	`prescriptionProgression` text DEFAULT 'double_progression' NOT NULL,
	`prescription` text NOT NULL,
	`targetSets` integer,
	`targetReps` integer,
	`targetLoad` integer,
	`target` text,
	`position` integer DEFAULT 0 NOT NULL,
	`userId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_workoutExercises`("id", "workoutId", "exerciseId", "exerciseName", "exerciseImageEtag", "exerciseDescription", "prescriptionSets", "prescriptionRepsMin", "prescriptionRepsMax", "prescriptionProgression", "prescription", "targetSets", "targetReps", "targetLoad", "target", "position", "userId", "createdAt", "updatedAt") SELECT "id", "workoutId", "exerciseId", "exerciseName", "exerciseImageEtag", "exerciseDescription", "prescriptionSets", "prescriptionRepsMin", "prescriptionRepsMax", "prescriptionProgression", json_object('sets', "prescriptionSets", 'reps', json_object('min', "prescriptionRepsMin", 'max', "prescriptionRepsMax"), 'progression', "prescriptionProgression"), "targetSets", "targetReps", "targetLoad", CASE WHEN "targetSets" IS NULL THEN NULL ELSE json_object('sets', "targetSets", 'reps', "targetReps", 'load', "targetLoad") END, "position", "userId", "createdAt", "updatedAt" FROM `workoutExercises`;--> statement-breakpoint
DROP TABLE `workoutExercises`;--> statement-breakpoint
ALTER TABLE `__new_workoutExercises` RENAME TO `workoutExercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
