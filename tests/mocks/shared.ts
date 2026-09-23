// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { ActionState } from "+action-state";

export const correlationId = v.parse(bg.CorrelationId, "00000000-0000-0000-0000-000000000000");

export const commit = bg.CommitSha.fromString("a".repeat(40)).value;
export const revision = new tools.Revision(0);

export const temporaryFileId = v.parse(bg.UUID, "738d1d64-0828-437e-a979-3dcebafe841a");

export const T0 = tools.Timestamp.fromInstant(Temporal.Instant.from("2025-01-01T00:00:00Z"));
export const T0Date = "Wed, 01 Jan 2025 00:00:00 GMT";

export const hourHasPassedTimestamp = T0;

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1" }) } };

export const revisionHeaders = (revision = 0) => ({
  "if-match": `W/${v.parse(tools.RevisionValue, revision)}`,
});
export const correlationIdHeaders = { "correlation-id": correlationId };
export const correlationIdAndRevisionHeaders = (revision = 0) => ({
  "if-match": `W/${v.parse(tools.RevisionValue, revision)}`,
  "correlation-id": correlationId,
});

export const actionAvailable: ActionState = { available: true, enabled: true, hints: [] };

export const actionUnavailable: ActionState = { available: false, enabled: false, hints: [] };

export const etag = bg.Hash.fromString("0000000000000000000000000000000000000000000000000000000000000000");

export const head = {
  exists: true,
  etag,
  size: tools.Size.fromBytes(1234),
  lastModified: T0,
  mime: tools.Mimes.webp.mime,
};

export const passageOfTimeStream = v.parse(bg.EventStream, "passage_of_time");

export const stream = () => new ReadableStream({ start: (controller) => controller.close() });

export const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "image.png");
