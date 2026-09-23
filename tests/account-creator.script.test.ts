import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import { bootstrap } from "+infra/bootstrap";
import { AccountCreator, AccountCreatorEmailTakenError } from "../scripts/account-creator";
import * as mocks from "./mocks";

describe("AccountCreator", async () => {
  const di = await bootstrap();
  const creator = new AccountCreator({ ...di.Adapters.System, ...di.Tools, Auth: di.Tools.Auth.config });
  const context = await di.Tools.Auth.config.$context;

  test("AccountCreatorEmailTakenError", async () => {
    using _ = spyOn(context.internalAdapter, "findUserByEmail").mockResolvedValue({
      user: mocks.user,
      accounts: [],
    });
    using createUser = spyOn(context.internalAdapter, "createUser");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save");

    expect(async () => creator.create(mocks.email)).toThrow(AccountCreatorEmailTakenError);
    expect(createUser).not.toHaveBeenCalled();
    expect(eventStoreSave).not.toHaveBeenCalled();
  });

  test("happy path", async () => {
    using _ = spyOn(context.internalAdapter, "findUserByEmail").mockResolvedValue(null);
    using createUser = spyOn(context.internalAdapter, "createUser").mockResolvedValue({
      ...mocks.user,
      emailVerified: true,
    });
    using linkAccount = spyOn(context.internalAdapter, "linkAccount").mockResolvedValue({
      id: mocks.userId,
      userId: mocks.userId,
      providerId: "credential",
      accountId: mocks.userId,
      // biome-ignore lint: lint/style/noRestrictedGlobals
      createdAt: new Date(),
      // biome-ignore lint: lint/style/noRestrictedGlobals
      updatedAt: new Date(),
    });
    using hash = spyOn(context.password, "hash").mockResolvedValue("hashed");
    using eventStoreSave = spyOn(di.Tools.EventStore, "save").mockResolvedValue([]);

    const result = await creator.create(mocks.email);

    expect(result.userId).toEqual(mocks.userId);
    expect(v.safeParse(bg.BasicAuthPassword, result.password).success).toEqual(true);
    expect(createUser).toHaveBeenCalledWith(
      { email: mocks.email, name: mocks.email, emailVerified: true },
      { method: "email-password" },
    );
    expect(hash).toHaveBeenCalledWith(result.password);
    expect(linkAccount).toHaveBeenCalledWith({
      userId: mocks.userId,
      providerId: "credential",
      accountId: mocks.userId,
      password: "hashed",
    });
    expect(eventStoreSave).toHaveBeenCalledWith([
      { ...mocks.GenericAccountCreatedEvent, correlationId: mocks.expectAnyId },
    ]);
  });
});
