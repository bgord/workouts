import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Measurements.Events.BodyPartDefinedEventType
    | Measurements.Events.BodyPartRenamedEventType
    | Measurements.Events.BodyPartDescriptionSetEventType
    | Measurements.Events.BodyPartDeletedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyPartsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Measurements.Events.BODY_PART_DEFINED_EVENT,
      deps.EventHandler.handle(this.onBodyPartDefinedEvent.bind(this)),
    );
    deps.EventBus.on(
      Measurements.Events.BODY_PART_RENAMED_EVENT,
      deps.EventHandler.handle(this.onBodyPartRenamedEvent.bind(this)),
    );
    deps.EventBus.on(
      Measurements.Events.BODY_PART_DESCRIPTION_SET_EVENT,
      deps.EventHandler.handle(this.onBodyPartDescriptionSetEvent.bind(this)),
    );
    deps.EventBus.on(
      Measurements.Events.BODY_PART_DELETED_EVENT,
      deps.EventHandler.handle(this.onBodyPartDeletedEvent.bind(this)),
    );
    deps.EventBus.on(
      Auth.Events.ACCOUNT_DELETED_EVENT,
      deps.EventHandler.handle(this.onAccountDeletedEvent.bind(this)),
    );
  }

  async onBodyPartDefinedEvent(event: Measurements.Events.BodyPartDefinedEventType) {
    await db.insert(Schema.bodyParts).values({
      id: event.payload.id,
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyPartRenamedEvent(event: Measurements.Events.BodyPartRenamedEventType) {
    await db
      .update(Schema.bodyParts)
      .set({ name: event.payload.name, updatedAt: event.createdAt })
      .where(eq(Schema.bodyParts.id, event.payload.id));
  }

  async onBodyPartDeletedEvent(event: Measurements.Events.BodyPartDeletedEventType) {
    await db.delete(Schema.bodyParts).where(eq(Schema.bodyParts.id, event.payload.id));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db.delete(Schema.bodyParts).where(eq(Schema.bodyParts.userId, event.payload.userId));
  }
}
