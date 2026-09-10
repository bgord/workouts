import * as v from "valibot";
import { Load } from "./load";
import { LoggedSetId } from "./logged-set-id";
import { Reps } from "./reps";
import { Rir } from "./rir";
import { SetNumber } from "./set-number";

export const LoggedSet = v.object({
  id: LoggedSetId,
  setNumber: SetNumber,
  reps: Reps,
  load: Load,
  rir: v.optional(Rir),
});

export type LoggedSetType = v.InferOutput<typeof LoggedSet>;
