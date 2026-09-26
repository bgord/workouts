import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | measurements.Events.BodyPartAddedEventType
    | measurements.Events.BodyPartRenamedEventType
    | measurements.Events.BodyPartArchivedEventType
    | measurements.Events.BodyPartMeasurementRecordedEventType
    | measurements.Events.BodyPartMeasurementCorrectedEventType
    | measurements.Events.BodyPartMeasurementRemovedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyPartMeasurementsProjector {
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
      measurements.Events.BODY_PART_ARCHIVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartArchivedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASUREMENT_RECORDED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementRecordedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASUREMENT_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASUREMENT_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementRemovedEvent.bind(this)),
    );
  }

  async onBodyPartAddedEvent(event: measurements.Events.BodyPartAddedEventType) {
    await db.insert(Schema.bodyParts).values({
      id: event.payload.id,
      userId: event.payload.userId,
      name: event.payload.name,
      normalizedName: event.payload.name.toLowerCase(),
      archived: false,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyPartRenamedEvent(event: measurements.Events.BodyPartRenamedEventType) {
    await db
      .update(Schema.bodyParts)
      .set({
        name: event.payload.name,
        normalizedName: event.payload.name.toLowerCase(),
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.bodyParts.id, event.payload.id));
  }

  async onBodyPartArchivedEvent(event: measurements.Events.BodyPartArchivedEventType) {
    await db
      .update(Schema.bodyParts)
      .set({ archived: true, updatedAt: event.createdAt })
      .where(eq(Schema.bodyParts.id, event.payload.id));
  }

  async onBodyPartMeasurementRecordedEvent(event: measurements.Events.BodyPartMeasurementRecordedEventType) {
    await db.insert(Schema.bodyPartMeasurements).values({
      id: event.payload.id,
      bodyPartId: event.payload.bodyPartId,
      userId: event.payload.userId,
      valueMm: event.payload.valueMm,
      measuredOn: event.payload.measuredOn,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyPartMeasurementCorrectedEvent(
    event: measurements.Events.BodyPartMeasurementCorrectedEventType,
  ) {
    await db
      .update(Schema.bodyPartMeasurements)
      .set({
        valueMm: event.payload.valueMm,
        measuredOn: event.payload.measuredOn,
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }

  async onBodyPartMeasurementRemovedEvent(event: measurements.Events.BodyPartMeasurementRemovedEventType) {
    await db.delete(Schema.bodyPartMeasurements).where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }
}
