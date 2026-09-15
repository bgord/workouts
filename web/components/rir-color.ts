export type RirColor = "positive-400" | "brand-400" | "danger-400";

export function RirColor(rir: number): RirColor {
  if (rir === 0) return "danger-400";
  if (rir === 1) return "brand-400";
  return "positive-400";
}
