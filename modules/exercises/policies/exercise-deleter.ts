import type * as bg from "@bgord/bun";
import type * as Exercises from "+exercises";
import { EXERCISE_DELETED_EVENT } from "../events/EXERCISE_DELETED_EVENT";

type AcceptedEvent = Exercises.Events.ExerciseDeletedEventType;

type Dependencies = {
  EventBus: bg.EventBusPort<AcceptedEvent>;
  EventHandler: bg.EventHandlerStrategy;
  RemoteFileStorage: bg.RemoteFileStoragePort;
};

export class ExerciseDeleter {
  // Stryker disable all
  constructor(private readonly deps: Dependencies) {
    deps.EventBus.on(
      EXERCISE_DELETED_EVENT,
      deps.EventHandler.handle(this.onExerciseDeletedEvent.bind(this)),
    );
  }
  // Stryker restore all

  async onExerciseDeletedEvent(event: Exercises.Events.ExerciseDeletedEventType) {
    await this.deps.RemoteFileStorage.delete(event.payload.image);
  }
}
