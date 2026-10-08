import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { BodyPart } from "../../modules/measurements/value-objects/body-part";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartDelete(props: BodyPart) {
  const t = bg.useTranslations();
  const router = useRouter();

  const bodyPartDelete = bg.useToggle({ name: `body-part-delete-${props.id}` });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/${props.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      bodyPartDelete.disable();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  return (
    <>
      <ui.IconButton
        aria-label={t("measurements.body_parts.delete.title", { name: props.name })}
        onClick={bodyPartDelete.enable}
        title={t("measurements.body_parts.delete.title", { name: props.name })}
        {...bodyPartDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...bodyPartDelete}>
        <ui.DialogHeader>{t("measurements.body_parts.delete.header")}</ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("measurements.body_parts.delete.info", { name: props.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("measurements.body_parts.delete.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={bodyPartDelete.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("measurements.body_parts.delete.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
