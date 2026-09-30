import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";

export async function seedAthlete(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.athlete.email);

  await draftPlan(di, userId, fixtures.athlete.plan);
  await finalizePlan(di, userId, fixtures.athlete.plan);

  console.log(`[✓] ${fixtures.athlete.email} plan finalized`);
}
