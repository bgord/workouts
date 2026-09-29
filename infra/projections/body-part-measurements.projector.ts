import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as Auth from "+auth";
import * as Measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | Measurements.Events.BodyPartMeasuredEventType
    | Measurements.Events.BodyPartMeasurementCorrectedEventType
    | Measurements.Events.BodyPartMeasurementRemovedEventType
    | Measurements.Events.BodyPartDeletedEventType
    | Auth.Events.AccountDeletedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyPartMeasurementsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      Measurements.Events.BODY_PART_MEASURED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasuredEvent.bind(this)),
    );
    deps.EventBus.on(
      Measurements.Events.BODY_PART_MEASUREMENT_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      Measurements.Events.BODY_PART_MEASUREMENT_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyPartMeasurementRemovedEvent.bind(this)),
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

  async onBodyPartMeasuredEvent(event: Measurements.Events.BodyPartMeasuredEventType) {
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
    event: Measurements.Events.BodyPartMeasurementCorrectedEventType,
  ) {
    await db
      .update(Schema.bodyPartMeasurements)
      .set({
        bodyPartId: event.payload.bodyPartId,
        value: event.payload.value,
        measuredOn: event.payload.measuredOn,
        updatedAt: event.createdAt,
      })
      .where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }

  async onBodyPartMeasurementRemovedEvent(event: Measurements.Events.BodyPartMeasurementRemovedEventType) {
    await db.delete(Schema.bodyPartMeasurements).where(eq(Schema.bodyPartMeasurements.id, event.payload.id));
  }

  async onBodyPartDeletedEvent(event: Measurements.Events.BodyPartDeletedEventType) {
    await db
      .delete(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.bodyPartId, event.payload.id));
  }

  async onAccountDeletedEvent(event: Auth.Events.AccountDeletedEventType) {
    await db
      .delete(Schema.bodyPartMeasurements)
      .where(eq(Schema.bodyPartMeasurements.userId, event.payload.userId));
  }
}
