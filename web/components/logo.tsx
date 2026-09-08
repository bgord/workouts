import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-history-filters-form";

export function Logo() {
  return (
    <Link search={Form.default} to="/">
      <div
        className="logo"
        data-color="brand-500"
        data-cross="center"
        data-disp="flex"
        data-fs="2xl"
        data-fw="bold"
        data-gap="2"
        data-lh="none"
        data-ls="wider"
        data-transform="uppercase"
      />
    </Link>
  );
}
