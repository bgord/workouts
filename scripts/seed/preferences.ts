import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";

export async function setLanguage(di: BootstrapType, userId: Auth.VO.UserIdType, language: string) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    bg.Preferences.Commands.SetUserLanguageCommand,
    { payload: { userId, language: v.parse(tools.Language, language) } },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function setWeeklySummary(
  di: BootstrapType,
  userId: Auth.VO.UserIdType,
  weeklySummary: Preferences.VO.WeeklySummaryOptions,
) {
  const deps = { ...di.Adapters.System, ...di.Tools };

  const command = bg.command(
    Preferences.Commands.WeeklySummarySetCommand,
    { payload: { userId, weeklySummary: v.parse(Preferences.VO.WeeklySummary, weeklySummary) } },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}
