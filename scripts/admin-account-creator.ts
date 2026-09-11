import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { eq, sql } from "drizzle-orm";
import * as v from "valibot";
import * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { AuthInstance } from "+infra/tools/shield-auth.strategy";

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  Auth: AuthInstance;
  EventStore: bg.EventStorePort<Auth.Events.AccountCreatedEventType>;
};

export class AdminAccountCreatorEmailTakenError extends Error {}

export class AdminAccountCreator {
  constructor(private readonly deps: Dependencies) {}

  async create(email: tools.EmailType, password: bg.BasicAuthPasswordType) {
    const correlationId = v.parse(bg.CorrelationId, this.deps.IdProvider.generate());

    await bg.CorrelationStorage.run(correlationId, async () => {
      const existing = await db.$count(Schema.users, eq(Schema.users.id, Auth.VO.ADMIN_USER_ID));

      if (existing > 0) {
        return this.deps.Logger.info({
          message: "Admin account exists",
          component: "infra",
          operation: "admin_account_creator",
          correlationId,
        });
      }

      const account = await this.deps.Auth.api.signUpEmail({ body: { email, name: email, password } });
      const generated = v.parse(Auth.VO.UserId, account.user.id);

      db.transaction((tx) => {
        tx.run(sql`PRAGMA defer_foreign_keys = ON`);

        tx.update(Schema.users)
          .set({ id: Auth.VO.ADMIN_USER_ID, emailVerified: true })
          .where(eq(Schema.users.id, generated))
          .run();

        tx.update(Schema.accounts)
          .set({ userId: Auth.VO.ADMIN_USER_ID, accountId: Auth.VO.ADMIN_USER_ID })
          .where(eq(Schema.accounts.userId, generated))
          .run();

        tx.update(Schema.sessions)
          .set({ userId: Auth.VO.ADMIN_USER_ID })
          .where(eq(Schema.sessions.userId, generated))
          .run();
      });

      const event = bg.event(
        Auth.Events.AccountCreatedEvent,
        `account_${Auth.VO.ADMIN_USER_ID}`,
        { userId: Auth.VO.ADMIN_USER_ID, timestamp: this.deps.Clock.now().ms },
        this.deps,
      );

      await this.deps.EventStore.save([event]);

      this.deps.Logger.info({
        message: "Admin account created",
        component: "infra",
        operation: "admin_account_creator",
        correlationId,
        metadata: { userId: Auth.VO.ADMIN_USER_ID },
      });
    });
  }
}
