import * as bg from "@bgord/bun";

const System = new bg.ClockSystemAdapter();

let current: bg.ClockPort = System;

export const now = System.now();

export const Clock: bg.ClockPort = { now: () => current.now() };

export async function withClock(clock: bg.ClockPort, run: () => Promise<void>) {
  current = clock;

  try {
    await run();
  } finally {
    current = System;
  }
}
