import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form as DescriptionForm } from "../../app/services/body-part-description-form";
import { Form } from "../../app/services/body-part-name-form";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartDefine() {
  const t = bg.useTranslations();
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);
  const description = bg.useTextField(DescriptionForm.description.field);

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/body-part", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: description.value?.trim() || undefined }),
      }),
    onSuccess: async (_, context) => {
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
      bg.Fields.clearAll([name, description]);
      context.form?.reset();
    },
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <div data-stack="y" {...ui.Gap.field}>
        <label {...name.label.props}>{t("measurements.body_parts.define.name.label")}</label>

        <div data-stack="x" {...ui.Gap.inline}>
          <input
            className="c-input"
            data-grow="1"
            data-minw="0"
            maxLength={Form.name.pattern.max}
            minLength={Form.name.pattern.min}
            placeholder={t("measurements.body_parts.define.name.placeholder")}
            required
            {...name.input.props}
          />

          <button
            className="c-button"
            data-variant="primary"
            disabled={name.empty || mutation.isLoading}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("measurements.body_parts.define.submit.cta")}
          </button>
        </div>
      </div>

      <div data-stack="y" {...ui.Gap.field}>
        <label {...description.label.props}>{t("measurements.body_parts.define.description.label")}</label>

        <textarea
          className="c-textarea"
          placeholder={t("measurements.body_parts.define.description.placeholder")}
          style={{ fieldSizing: "content" }}
          {...bg.Form.textarea(DescriptionForm.description.pattern)}
          {...description.input.props}
          {...metaEnterSubmit}
        />
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("measurements.body_parts.define.error")}
        </output>
      )}
    </form>
  );
}
