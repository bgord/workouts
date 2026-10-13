import type { StepsProviderPort } from "+measurements/ports";
import * as VO from "+measurements/value-objects";

type Config = { count: VO.StepsCountType };

export class StepsProviderManualStrategy implements StepsProviderPort {
  readonly source = VO.StepsSourceOptions.manual;

  constructor(private readonly config: Config) {}

  async provide(): Promise<VO.StepsCountType> {
    return this.config.count;
  }
}
