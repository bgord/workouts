import { expect } from "bun:test";
import * as bg from "@bgord/bun";

export async function assertErrorResponse(response: Response, code: number, message: string) {
  const json = await response.json();

  expect(response.status).toEqual(code);
  expect(json).toEqual({ message });
}

export async function assertAuthResponse(response: Response) {
  const json = await response.json();

  expect(response.status).toEqual(401);
  expect(json).toEqual({ message: bg.ShieldAuthStrategyError.Rejected });
}
