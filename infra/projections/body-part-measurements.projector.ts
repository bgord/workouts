import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | measurements.Events.BodyPartMeasuredEventType
    | measurements.Events.BodyPartMeasurementCorrectedEventType
    | measurements.Events.BodyPartMeasurementRemovedEventType
    | measurements.Events.BodyPartRemovedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyPartMeasurementsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASURED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasuredEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASUREMENT_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_MEASUREMENT_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementRemovedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_PART_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartRemovedEvent.bind(this)),
    );
  }

  async onBodyPartMeasuredEvent(event: measurements.Events.BodyPartMeasuredEventType) {
    await db.insert(Schema.bodyPartMeasurements).values({
      id: event.payload.id,
      bodyPartId: event.payload.bodyPartId,
      value: event.payload.value,
      measuredOn: event.payload.measuredOn,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyPartMeasurementCorrectedEvent(
    event: measurements.Events.BodyPartMeasurementCorrectedEventType,
  ) {
    await db
      .update(Schema.bodyPartMeasurements)
      .set({ value: event.payload.value, measuredOn: event.payload.measuredOn, updatedAt: event.createdAt })
      .where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }

  async onBodyPartMeasurementRemovedEvent(event: measurements.Events.BodyPartMeasurementRemovedEventType) {
    await db.delete(Schema.bodyPartMeasurements).where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }

  async onBodyPartRemovedEvent(event: measurements.Events.BodyPartRemovedEventType) {
    await db
      .delete(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.bodyPartId, event.payload.id));
  }
}
