import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import type { AuthInstance } from "+infra/tools/shield-auth.strategy";

type Dependencies = {
  Logger: bg.LoggerPort;
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommitConfig: bg.StaticConfigPort<bg.CommitShaValueType>;
  SecureKeyGenerator: bg.SecureKeyGeneratorPort;
  Auth: AuthInstance;
  EventStore: bg.EventStorePort<Auth.Events.AccountCreatedEventType>;
};

export class AccountCreatorEmailTakenError extends Error {}

export class AccountCreator {
  static readonly PASSWORD_BYTES = v.parse(tools.IntegerPositive, 24);

  constructor(private readonly deps: Dependencies) {}

  async create(email: tools.EmailType) {
    const correlationId = v.parse(bg.CorrelationId, this.deps.IdProvider.generate());

    return bg.CorrelationStorage.run(correlationId, async () => {
      const context = await this.deps.Auth.$context;

      const existing = await context.internalAdapter.findUserByEmail(email);

      if (existing) throw new AccountCreatorEmailTakenError();

      const password = v.parse(
        bg.BasicAuthPassword,
        Buffer.from(this.deps.SecureKeyGenerator.generate(AccountCreator.PASSWORD_BYTES)).toString(
          "base64url",
        ),
      );

      const user = await context.internalAdapter.createUser(
        { email, name: email, emailVerified: true },
        { method: "email-password" },
      );
      const userId = v.parse(Auth.VO.UserId, user.id);

      await context.internalAdapter.linkAccount({
        userId,
        providerId: "credential",
        accountId: userId,
        password: await context.password.hash(password),
      });

      const event = bg.event(
        Auth.Events.AccountCreatedEvent,
        `account_${userId}`,
        { userId, timestamp: this.deps.Clock.now().ms },
        this.deps,
      );

      await this.deps.EventStore.save([event]);

      this.deps.Logger.info({
        message: "Account created",
        component: "infra",
        operation: "account_creator",
        correlationId,
        metadata: { userId },
      });

      return { userId, password };
    });
  }
}
