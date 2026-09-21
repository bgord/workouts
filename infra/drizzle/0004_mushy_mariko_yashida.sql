ALTER TABLE `planSectionExerciseInstructions` ADD `position` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
UPDATE `planSectionExerciseInstructions` SET `position` = (
  SELECT COUNT(*) FROM `planSectionExerciseInstructions` AS `earlier`
  WHERE `earlier`.`planSectionId` = `planSectionExerciseInstructions`.`planSectionId`
    AND (`earlier`.`createdAt` < `planSectionExerciseInstructions`.`createdAt`
      OR (`earlier`.`createdAt` = `planSectionExerciseInstructions`.`createdAt` AND `earlier`.`rowid` < `planSectionExerciseInstructions`.`rowid`))
);
