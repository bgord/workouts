import { sql } from "drizzle-orm";
import type * as Stats from "+stats";
import * as Schema from "+infra/schema";

export const performedSets = sql`json_group_array(
  json_object('reps', ${Schema.statsExerciseSets.reps}, 'load', ${Schema.statsExerciseSets.load})
  order by ${Schema.statsExerciseSets.loggedAt} asc
)`.mapWith((value: string): Array<Stats.VO.PerformedSet> => JSON.parse(value));
