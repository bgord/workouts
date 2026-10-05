import type * as bg from "@bgord/ui";
import { useState } from "react";
import type { LoggedSet } from "../../modules/workouts/queries/get-workout";

type SetId = LoggedSet["id"];

export function useSetCorrection() {
  const [active, setActive] = useState<SetId | null>(null);

  const toggle = (id: SetId): bg.UseToggleReturnType => {
    const on = active === id;
    const name = `correct-${id}`;

    return {
      on,
      off: !on,
      enable: () => setActive(id),
      disable: () => setActive((current) => (current === id ? null : current)),
      toggle: () => setActive(on ? null : id),
      props: {
        controller: {
          "aria-expanded": on ? "true" : "false",
          "aria-controls": name,
          role: "button",
          tabIndex: 0,
        },
        target: { id: name, "aria-hidden": on ? "false" : "true" },
      },
    };
  };

  return { active, toggle };
}
