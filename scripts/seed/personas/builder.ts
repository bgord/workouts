import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import type * as fixtures from "../fixtures";
import { draftPlan } from "../plans";

export async function seedBuilder(di: BootstrapType, persona: typeof fixtures.builder) {
  const userId = await createAccount(di, persona.email);

  await draftPlan(di, userId, persona.plan);

  console.log(`[✓] ${persona.email} plan drafted`);
}
