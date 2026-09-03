import * as v from "valibot";
import { Load } from "./load";
import { Reps } from "./reps";
import { SetNumber } from "./set-number";

export const LoggedSet = v.object({ setNumber: SetNumber, reps: Reps, load: Load });

export type LoggedSetType = v.InferOutput<typeof LoggedSet>;
