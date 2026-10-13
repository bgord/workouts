import type { StepsProviderPort } from "+measurements/ports";
import type * as VO from "+measurements/value-objects";

type Config = { count: VO.StepsCountType };

export class StepsProviderManualStrategy implements StepsProviderPort {
  constructor(private readonly config: Config) {}

  async provide(): Promise<VO.StepsCountType> {
    return this.config.count;
  }
}
