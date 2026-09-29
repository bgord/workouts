import type * as VO from "+measurements/value-objects";

type BodyPartSummariesFacts = {
  bodyParts: ReadonlyArray<VO.BodyPart>;
  measurements: ReadonlyArray<VO.BodyPartRecentMeasurement>;
};

export class BodyPartSummaries {
  constructor(private readonly facts: BodyPartSummariesFacts) {}

  calculate(): ReadonlyArray<VO.BodyPartSummary> {
    return this.facts.bodyParts.map((bodyPart) => {
      const recent = this.facts.measurements
        .filter((measurement) => measurement.bodyPartId === bodyPart.id)
        .map(({ id, value, measuredOn }) => ({ id, value, measuredOn }));

      const [latest, previous] = recent;

      return {
        ...bodyPart,
        latest: latest ?? null,
        previous: previous ?? null,
        delta: latest && previous ? latest.value - previous.value : null,
        series: recent.map(({ value, measuredOn }) => ({ value, measuredOn })).reverse(),
      };
    });
  }
}
