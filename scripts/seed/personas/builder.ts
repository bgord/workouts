import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { draftPlan } from "../plans";

export async function seedBuilder(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.builder.email);

  await draftPlan(di, userId, fixtures.builder.plan);

  console.log(`[✓] ${fixtures.builder.email} plan drafted`);
}
