ALTER TABLE `workoutExercises` ADD `position` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `workoutExercises` SET `position` = (
  SELECT COUNT(*) FROM `workoutExercises` AS `earlier`
  WHERE `earlier`.`workoutId` = `workoutExercises`.`workoutId`
    AND (`earlier`.`createdAt` < `workoutExercises`.`createdAt`
      OR (`earlier`.`createdAt` = `workoutExercises`.`createdAt` AND `earlier`.`rowid` < `workoutExercises`.`rowid`))
);
