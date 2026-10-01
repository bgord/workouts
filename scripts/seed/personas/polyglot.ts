import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import type * as fixtures from "../fixtures";
import { setLanguage, setWeeklySummary } from "../preferences";

export async function seedPolyglot(di: BootstrapType, persona: typeof fixtures.polyglot) {
  const userId = await createAccount(di, persona.email);

  await Bun.sleep(tools.Duration.Ms(10).ms);

  await setLanguage(di, userId, persona.language);
  await setWeeklySummary(di, userId, Preferences.VO.WeeklySummaryOptions.off);

  console.log(`[✓] ${persona.email} language and weekly summary set`);
}
