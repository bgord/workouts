import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-history-filters-form";
import { Spacing } from "./spacing";

export function Logo() {
  return (
    <Link data-cross="center" data-main="center" data-stack="x" search={Form.default} to="/">
      <div
        className="logo"
        data-color="brand-500"
        data-cross="center"
        data-disp="flex"
        data-fs="2xl"
        data-fw="bold"
        data-lh="none"
        data-ls="wider"
        data-transform="uppercase"
        {...Spacing.cluster}
      />
    </Link>
  );
}
