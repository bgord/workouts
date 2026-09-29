import type * as VO from "+measurements/value-objects";

export class BodyPartMeasurementDeltas {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyPartMeasurement>) {}

  calculate(): ReadonlyArray<VO.BodyPartMeasurementWithDelta> {
    return this.measurements.map((measurement, index) => {
      const older = this.measurements[index + 1];

      return { ...measurement, delta: older ? measurement.value - older.value : null };
    });
  }
}
