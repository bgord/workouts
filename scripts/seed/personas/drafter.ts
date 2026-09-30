import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { draftPlan } from "../plans";

export async function seedDrafter(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.drafter.email);

  await draftPlan(di, userId, fixtures.drafter.plan);

  console.log(`[✓] ${fixtures.drafter.email} plan drafted`);
}
