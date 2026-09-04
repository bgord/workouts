import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const LoggedSetId = v.pipe(bg.UUID, v.brand("LoggedSetId"));
export type LoggedSetIdType = v.InferOutput<typeof LoggedSetId>;
