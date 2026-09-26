import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | measurements.Events.BodyPartAddedEventType
    | measurements.Events.BodyPartRenamedEventType
    | measurements.Events.BodyPartRemovedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyPartsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      measurements.Events.BODY_PART_ADDED_EVENT,
      deps.EventHandler.handle(this.onBodyPartAddedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_RENAMED_EVENT,
      deps.EventHandler.handle(this.onBodyPartRenamedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartRemovedEvent.bind(this)),
    );
  }

  async onBodyPartAddedEvent(event: measurements.Events.BodyPartAddedEventType) {
    await db.insert(Schema.bodyParts).values({
      id: event.payload.id,
      name: event.payload.name,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyPartRenamedEvent(event: measurements.Events.BodyPartRenamedEventType) {
    await db
      .update(Schema.bodyParts)
      .set({ name: event.payload.name, updatedAt: event.createdAt })
      .where(eq(Schema.bodyParts.id, event.payload.id));
  }

  async onBodyPartRemovedEvent(event: measurements.Events.BodyPartRemovedEventType) {
    await db.delete(Schema.bodyParts).where(eq(Schema.bodyParts.id, event.payload.id));
  }
}
