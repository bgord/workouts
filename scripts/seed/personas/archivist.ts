import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { archivePlan, draftPlan, finalizePlan } from "../plans";

export async function seedArchivist(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.archivist.email);

  await draftPlan(di, userId, fixtures.archivist.archivedPlan);
  await finalizePlan(di, userId, fixtures.archivist.archivedPlan);
  await archivePlan(di, userId, fixtures.archivist.archivedPlan);

  await Bun.sleep(tools.Duration.Ms(10).ms);

  await draftPlan(di, userId, fixtures.archivist.plan);

  console.log(`[✓] ${fixtures.archivist.email} plan archived, next plan drafted`);
}
