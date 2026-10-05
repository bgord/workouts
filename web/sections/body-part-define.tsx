import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/body-part-name-form";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartDefine() {
  const t = bg.useTranslations();
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/measurements/body-part", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async (_, context) => {
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
      bg.Fields.clearAll([name]);
      context.form?.reset();
    },
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <div data-stack="x" {...ui.Gap.inline}>
        <label className="c-visually-hidden" {...name.label.props}>
          {t("measurements.body_parts.define.name.label")}
        </label>

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

        <ui.IconButton
          aria-label={t("measurements.body_parts.define.submit.cta")}
          disabled={name.empty || mutation.isLoading}
          title={t("measurements.body_parts.define.submit.cta")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.clear")}
          disabled={name.unchanged}
          onClick={bg.exec([name.clear, mutation.reset])}
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("measurements.body_parts.define.error")}
        </output>
      )}
    </form>
  );
}
