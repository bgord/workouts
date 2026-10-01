import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import type * as fixtures from "../fixtures";
import { archivePlan, draftPlan, finalizePlan } from "../plans";

export async function seedArchivist(di: BootstrapType, persona: typeof fixtures.archivist) {
  const userId = await createAccount(di, persona.email);

  await draftPlan(di, userId, persona.archivedPlan);
  await finalizePlan(di, userId, persona.archivedPlan);
  await archivePlan(di, userId, persona.archivedPlan);

  await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

  await draftPlan(di, userId, persona.plan);

  console.log(`[✓] ${persona.email} plan archived, next plan drafted`);
}
