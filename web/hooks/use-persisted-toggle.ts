import * as bg from "@bgord/ui";
import { useEffect } from "react";

const key = (name: string) => `toggle:${name}`;

const read = (name: string): bg.UseToggleValueType | null => {
  try {
    const stored = localStorage.getItem(key(name));
    return stored === null ? null : stored === "on";
  } catch {
    return null;
  }
};

const write = (name: string, on: bg.UseToggleValueType) => {
  try {
    localStorage.setItem(key(name), on ? "on" : "off");
  } catch {}
};

export function usePersistedToggle(config: bg.UseToggleConfigType): bg.UseToggleReturnType {
  const toggle = bg.useToggle(config);

  useEffect(() => {
    const stored = read(config.name);

    if (stored === true) toggle.enable();
    if (stored === false) toggle.disable();
  }, [config.name]);

  return {
    ...toggle,
    enable: () => {
      write(config.name, true);
      toggle.enable();
    },
    disable: () => {
      write(config.name, false);
      toggle.disable();
    },
    toggle: () => {
      write(config.name, !toggle.on);
      toggle.toggle();
    },
  };
}
