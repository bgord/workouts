import * as tools from "@bgord/tools";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import * as fixtures from "../fixtures";
import { setLanguage, setWeeklySummary } from "../preferences";

export async function seedPolyglot(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.polyglot.email);

  await Bun.sleep(tools.Duration.Ms(10).ms);

  await setLanguage(di, userId, fixtures.polyglot.language);
  await setWeeklySummary(di, userId, Preferences.VO.WeeklySummaryOptions.off);

  console.log(`[✓] ${fixtures.polyglot.email} language and weekly summary set`);
}
