import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import type * as fixtures from "../fixtures";

export async function seedEmpty(di: BootstrapType, persona: typeof fixtures.empty) {
  await createAccount(di, persona.email);
}
