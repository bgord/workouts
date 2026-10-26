import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import * as mocks from "./mocks";

describe("ProfileAvatar", () => {
  test("key", () => {
    expect(Preferences.VO.ProfileAvatar.key(mocks.userId)).toEqual(mocks.profileAvatarObjectKey);
  });

  test("MimeRegistry", () => {
    expect(Preferences.VO.ProfileAvatar.MimeRegistry.hasMime(tools.Mimes.png.mime)).toEqual(true);
  });
});
