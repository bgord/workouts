import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";

export async function seedActive(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.active.email);

  await draftPlan(di, userId, fixtures.active.plan);
  await finalizePlan(di, userId, fixtures.active.plan);

  console.log(`[✓] ${fixtures.active.email} plan finalized`);
}
