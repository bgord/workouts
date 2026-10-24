// cspell:disable
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { userId } from "./auth";

export const profileAvatarObjectKey = v.parse(tools.ObjectKey, `users/${userId}/avatar.webp`);
