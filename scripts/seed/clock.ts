import * as bg from "@bgord/bun";

const System = new bg.ClockSystemAdapter();

let current: bg.ClockPort = System;

export const now = System.now();

export const Clock: bg.ClockPort = { now: () => current.now() };

export async function withClock<T>(clock: bg.ClockPort, run: () => Promise<T>) {
  current = clock;

  try {
    return await run();
  } finally {
    current = System;
  }
}
