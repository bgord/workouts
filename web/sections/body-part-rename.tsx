import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Form as DescriptionForm } from "../../app/services/body-part-description-form";
import { Form } from "../../app/services/body-part-name-form";
import type { BodyPart } from "../../modules/measurements/value-objects/body-part";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartRename(props: BodyPart & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.name });
  const description = bg.useTextField({
    ...DescriptionForm.description.field,
    defaultValue: props.description ?? "",
  });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: async () => {
      if (name.changed) {
        const renamed = await fetch(`/api/measurements/body-part/${props.id}`, {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({ name: name.value }),
        });

        if (!renamed.ok) return renamed;
      }

      if (description.unchanged) return new Response();

      return fetch(`/api/measurements/body-part/${props.id}/description`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ description: description.value?.trim() || null }),
      });
    },
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  if (toggle.off) {
    return (
      <ui.IconButton
        aria-label={t("measurements.body_parts.rename.cta", { name: props.name })}
        onClick={toggle.enable}
        title={t("measurements.body_parts.rename.cta", { name: props.name })}
        {...toggle.props.controller}
      >
        <Pencil data-size="sm" />
      </ui.IconButton>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("measurements.body_parts.rename.cta", { name: props.name })}
      data-grow="1"
      data-main="center"
      data-minw="0"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...bg.Rhythm(43).times(1).style.minHeight}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("measurements.body_parts.rename.label")}
          autoFocus
          className="c-input"
          data-grow="1"
          data-minw="0"
          maxLength={Form.name.pattern.max}
          minLength={Form.name.pattern.min}
          required
          {...name.input.props}
        />

        <ui.InlineEditActions
          disabled={bg.Fields.allUnchanged([name, description]) || mutation.isLoading}
          onCancel={bg.exec([name.clear, description.clear, mutation.reset, toggle.disable])}
        />
      </div>

      <textarea
        aria-label={t("measurements.body_parts.rename.description.label")}
        className="c-textarea"
        placeholder={t("measurements.body_parts.rename.description.placeholder")}
        style={{ fieldSizing: "content" }}
        {...bg.Form.textarea(DescriptionForm.description.pattern)}
        {...description.input.props}
        {...metaEnterSubmit}
      />

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("measurements.body_parts.rename.error")}
        </output>
      )}
    </form>
  );
}
