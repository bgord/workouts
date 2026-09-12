import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import type { AccountCreatedEventType, AccountDeletedEventType } from "+auth/events";
import { db } from "+infra/db";
import type { EnvironmentResultType } from "+infra/env";
import * as schema from "+infra/schema";
import type {
  BodyWeightMeasuredEventType,
  BodyWeightMeasurementCorrectedEventType,
  BodyWeightMeasurementRemovedEventType,
  BodyWeightReferenceSetEventType,
} from "+measurements/events";
import type { PlanEventType } from "+plans/aggregates";
import type { ProfileAvatarRemovedEventType, ProfileAvatarUpdatedEventType } from "+preferences/events";
import type { WorkoutEventType } from "+workouts/aggregates";

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEventType>;
  Logger: bg.LoggerPort;
  Clock: bg.ClockPort;
};

export type AcceptedEventType =
  | bg.System.Events.HourHasPassedEventType
  | bg.System.Events.SecurityViolationDetectedEventType
  | AccountCreatedEventType
  | AccountDeletedEventType
  | PlanEventType
  | WorkoutEventType
  | bg.Preferences.Events.UserLanguageSetEventType
  | ProfileAvatarUpdatedEventType
  | ProfileAvatarRemovedEventType
  | BodyWeightMeasuredEventType
  | BodyWeightMeasurementCorrectedEventType
  | BodyWeightMeasurementRemovedEventType
  | BodyWeightReferenceSetEventType;

export function createEventStore(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.EventStorePort<AcceptedEventType> {
  const revision = new bg.EventRevisionAssignerAdapter();
  const serializer = new bg.PayloadSerializerJsonAdapter();

  const finder: bg.EventFinderPort = {
    find: async (stream, names, config) => {
      const conditions = [eq(schema.events.stream, stream), inArray(schema.events.name, names)];

      if (config?.fromRevision) conditions.push(gte(schema.events.revision, config.fromRevision));

      return db
        .select()
        .from(schema.events)
        .where(and(...conditions))
        .orderBy(asc(schema.events.revision));
    },
  };

  const finderLast: bg.EventFinderLastPort = {
    findLast: async (stream, names) => {
      const result = await db
        .select()
        .from(schema.events)
        .where(and(eq(schema.events.stream, stream), inArray(schema.events.name, names)))
        .orderBy(desc(schema.events.revision))
        .limit(1);

      return result[0] ?? null;
    },
  };

  const inserter: bg.EventInserterPort = {
    insert: async (incoming) => {
      const first = incoming[0];

      if (!first) return [];

      const stream = first.stream;

      return db.transaction(async (tx) => {
        const current = await tx
          .select({ max: sql<number>`max(${schema.events.revision})` })
          .from(schema.events)
          .where(eq(schema.events.stream, stream));

        const rows = revision.assign(incoming, current[0]?.max);

        try {
          await tx.insert(schema.events).values([...rows]);

          return rows;
        } catch (error: any) {
          if (error.code === "SQLITE_CONSTRAINT") throw new Error(tools.RevisionError.Mismatch);
          throw error;
        }
      });
    },
  };

  const EventStore = new bg.EventStoreAdapter<AcceptedEventType>({
    finder,
    finderLast,
    inserter,
    serializer,
  });

  const EventStoreDispatching = new bg.EventStoreDispatchingAdapter<AcceptedEventType>({
    inner: EventStore,
    ...deps,
  });

  const EventStoreWithLogger = new bg.EventStoreWithLoggerAdapter<AcceptedEventType>({
    inner: EventStoreDispatching,
    ...deps,
  });

  return {
    [bg.NodeEnvironmentEnum.local]: EventStoreWithLogger,
    [bg.NodeEnvironmentEnum.test]: new bg.EventStoreAdapter<AcceptedEventType>({
      finder,
      finderLast,
      inserter: new bg.EventInserterNoopAdapter(),
      serializer,
    }),
    [bg.NodeEnvironmentEnum.staging]: EventStoreWithLogger,
    [bg.NodeEnvironmentEnum.production]: EventStoreWithLogger,
  }[Env.type];
}
