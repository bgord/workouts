import * as v from "valibot";
import { UserId } from "./user-id";

// Stryker disable next-line StringLiteral
export const SYSTEM_USER_ID = v.parse(UserId, "00000000-0000-4000-8000-000000000001");
