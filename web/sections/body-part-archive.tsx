import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Archive } from "lucide-react";
import type { BodyPartListItem } from "../../modules/measurements/queries/list-body-parts";
import * as ui from "../components";
import { measurementsRoute } from "../router";

export function BodyPartArchive(props: BodyPartListItem) {
  const t = bg.useTranslations();
  const router = useRouter();

  const bodyPartArchive = bg.useToggle({ name: `body-part-archive-${props.id}` });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/${props.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      bodyPartArchive.disable();
      await router.invalidate({ filter: (match) => match.routeId === measurementsRoute.id, sync: true });
    },
  });

  if (!props.actions.archive.available) return null;

  return (
    <>
      <ui.IconButton
        aria-label={t("measurements.body_parts.archive.title", { name: props.name })}
        disabled={!props.actions.archive.enabled}
        onClick={bodyPartArchive.enable}
        title={t("measurements.body_parts.archive.title", { name: props.name })}
        tone="danger"
        {...bodyPartArchive.props.controller}
      >
        <Archive data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...bodyPartArchive}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bodyPartArchive.disable}>
          {t("measurements.body_parts.archive.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("measurements.body_parts.archive.info", { name: props.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("measurements.body_parts.archive.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={bodyPartArchive.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("measurements.body_parts.archive.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
