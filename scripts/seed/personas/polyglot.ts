import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";

export async function seedPolyglot(di: BootstrapType) {
  await createAccount(di, fixtures.polyglot.email);
}
