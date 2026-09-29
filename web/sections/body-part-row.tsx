import * as bg from "@bgord/ui";
import type { BodyPartListItem } from "../../modules/measurements/queries/list-body-parts";
import * as ui from "../components";
import { BodyPartArchive } from "./body-part-archive";
import { BodyPartRename } from "./body-part-rename";

export function BodyPartRow(props: BodyPartListItem) {
  const bodyPartRename = bg.useToggle({ name: `body-part-rename-${props.id}` });

  return (
    <li
      data-hover-bg={bodyPartRename.off ? "alpha-subtle" : undefined}
      data-main="between"
      data-px={bodyPartRename.off ? "3" : undefined}
      data-stack="x"
      {...ui.Spacing.rowCompact}
    >
      <BodyPartRename {...props} {...bodyPartRename} />

      {bodyPartRename.off && <BodyPartArchive {...props} />}
    </li>
  );
}
