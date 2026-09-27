import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Measurements.Events.BodyPartDefinedEventType
    | Measurements.Events.BodyPartRenamedEventType
    | Measurements.Events.BodyPartArchivedEventType
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
      Measurements.Events.BODY_PART_ARCHIVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartArchivedEvent.bind(this)),
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

  async onBodyPartArchivedEvent(event: Measurements.Events.BodyPartArchivedEventType) {
    await db
      .update(Schema.bodyParts)
      .set({ archivedAt: event.createdAt, updatedAt: event.createdAt })
      .where(eq(Schema.bodyParts.id, event.payload.id));
  }
}
