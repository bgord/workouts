import type * as tools from "@bgord/tools";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+stats/value-objects";
import { ExerciseRecordOrder } from "./exercise-record-order";
import type { OneRepMaxCandidates } from "./one-rep-max-candidates";
import { SessionVolume } from "./session-volume";

type Dependencies = { OneRepMaxCandidates: OneRepMaxCandidates };

export type CompletedSet = VO.PerformedSet & {
  userId: Auth.VO.UserIdType;
  exerciseId: Exercises.VO.ExerciseIdType;
  workoutId: VO.ExerciseSession["workoutId"];
  completedAt: tools.TimestampValueType;
};

type ExerciseSessionSets = Omit<CompletedSet, "reps" | "load"> & { sets: Array<VO.PerformedSet> };

export type MeasuredExerciseSession = ExerciseSessionSets & {
  volume: VO.VolumeType;
  estimated?: VO.EstimatedRecord;
  topSet: VO.ExerciseRecord;
};

export class ExerciseSessions {
  constructor(private readonly deps: Dependencies) {}

  from(sets: ReadonlyArray<CompletedSet>): Array<MeasuredExerciseSession> {
    return this.group(sets).map((session) => this.measure(session));
  }

  private group(sets: ReadonlyArray<CompletedSet>): Array<ExerciseSessionSets> {
    const sessions = new Map<Exercises.VO.ExerciseIdType, ExerciseSessionSets>();

    for (const { reps, load, ...set } of sets) {
      const session = sessions.get(set.exerciseId);

      if (session) session.sets.push({ reps, load });
      else sessions.set(set.exerciseId, { ...set, sets: [{ reps, load }] });
    }

    return Array.from(sessions.values());
  }

  private measure(session: ExerciseSessionSets): MeasuredExerciseSession {
    const topSet = session.sets
      .map((set) => ({ ...set, workoutId: session.workoutId, completedAt: session.completedAt }))
      .reduce((best, record) => (ExerciseRecordOrder.compare(record, best) < 0 ? record : best));

    return {
      ...session,
      volume: SessionVolume.calculate(session.sets),
      estimated: this.deps.OneRepMaxCandidates.from(session).at(0),
      topSet,
    };
  }
}
