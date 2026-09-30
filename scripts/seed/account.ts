import * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import type { BootstrapType } from "+infra/bootstrap";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as fixtures from "./fixtures";

export async function createAccount(di: BootstrapType, email: string) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const result = await di.Tools.Auth.config.api.signUpEmail({
    body: { email, name: email, password: fixtures.password },
  });

  await db.update(Schema.users).set({ emailVerified: true }).where(eq(Schema.users.email, email));

  const userId = v.parse(Auth.VO.UserId, result.user.id);

  const event = bg.event(
    Auth.Events.AccountCreatedEvent,
    `account_${userId}`,
    { userId, timestamp: di.Adapters.System.Clock.now().ms },
    deps,
  );

  await di.Tools.EventStore.save([event]);

  console.log(`[✓] ${email} created`);

  return userId;
}
