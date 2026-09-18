import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
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
      const context = await this.deps.Auth.$context;

      const existing = await context.internalAdapter.findUserById(Auth.VO.ADMIN_USER_ID);

      if (existing) {
        return this.deps.Logger.info({
          message: "Admin account exists",
          component: "infra",
          operation: "admin_account_creator",
          correlationId,
        });
      }

      await context.internalAdapter.createUser(
        { id: Auth.VO.ADMIN_USER_ID, email, name: email, emailVerified: true },
        { method: "email-password" },
      );

      await context.internalAdapter.linkAccount({
        userId: Auth.VO.ADMIN_USER_ID,
        providerId: "credential",
        accountId: Auth.VO.ADMIN_USER_ID,
        password: await context.password.hash(password),
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
