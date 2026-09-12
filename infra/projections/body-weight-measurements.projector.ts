import type * as bg from "@bgord/bun";
import { eq } from "drizzle-orm";
import * as measurements from "+measurements";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

type Dependencies = {
  EventBus: bg.EventBusPort<
    | measurements.Events.BodyWeightMeasuredEventType
    | measurements.Events.BodyWeightMeasurementCorrectedEventType
    | measurements.Events.BodyWeightMeasurementRemovedEventType
  >;
  EventHandler: bg.EventHandlerStrategy;
};

export class BodyWeightMeasurementsProjector {
  constructor(deps: Dependencies) {
    deps.EventBus.on(
      measurements.Events.BODY_WEIGHT_MEASURED_EVENT,
      deps.EventHandler.handle(this.onBodyWeightMeasuredEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT,
      deps.EventHandler.handle(this.onBodyWeightMeasurementCorrectedEvent.bind(this)),
    );
    deps.EventBus.on(
      measurements.Events.BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT,
      deps.EventHandler.handle(this.onBodyWeightMeasurementRemovedEvent.bind(this)),
    );
  }

  async onBodyWeightMeasuredEvent(event: measurements.Events.BodyWeightMeasuredEventType) {
    await db.insert(Schema.bodyWeightMeasurements).values({
      id: event.payload.id,
      weight: event.payload.weight,
      measuredOn: event.payload.measuredOn,
      userId: event.payload.userId,
      createdAt: event.createdAt,
      updatedAt: event.createdAt,
    });
  }

  async onBodyWeightMeasurementCorrectedEvent(
    event: measurements.Events.BodyWeightMeasurementCorrectedEventType,
  ) {
    await db
      .update(Schema.bodyWeightMeasurements)
      .set({ weight: event.payload.weight, measuredOn: event.payload.measuredOn, updatedAt: event.createdAt })
      .where(eq(Schema.bodyWeightMeasurements.id, event.payload.id));
  }

  async onBodyWeightMeasurementRemovedEvent(
    event: measurements.Events.BodyWeightMeasurementRemovedEventType,
  ) {
    await db
      .delete(Schema.bodyWeightMeasurements)
      .where(eq(Schema.bodyWeightMeasurements.id, event.payload.id));
  }
}
