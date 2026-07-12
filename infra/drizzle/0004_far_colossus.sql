PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercise_category_assignments` (
	`exerciseId` text(36) NOT NULL,
	`exerciseCategoryId` text(36) NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`exerciseId`, `exerciseCategoryId`)
);
--> statement-breakpoint
INSERT INTO `__new_exercise_category_assignments`("exerciseId", "exerciseCategoryId", "createdAt") SELECT "exerciseId", "exerciseCategoryId", "createdAt" FROM `exercise_category_assignments`;--> statement-breakpoint
DROP TABLE `exercise_category_assignments`;--> statement-breakpoint
ALTER TABLE `__new_exercise_category_assignments` RENAME TO `exercise_category_assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;