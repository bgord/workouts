import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-create-form";
import { plansRoute } from "../router";

export function PlanCreate() {
  const t = bg.useTranslations();
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/plans/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async (_, context) => {
      await router.invalidate({ filter: (route) => route.id === plansRoute.id, sync: true });
      bg.Fields.clearAll([name]);
      context.form?.reset();
    },
  });

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit}>
      <div data-cross="center" data-gap="2" data-stack="x">
        <label className="c-visually-hidden" {...name.label.props}>
          {t("plan.create.name.label")}
        </label>

        <input
          className="c-input"
          data-md-grow="1"
          data-md-width="100%"
          placeholder={t("plan.create.name.placeholder")}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <div data-cross="center" data-gap="2" data-md-width="100%" data-stack="x">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="secondary"
            disabled={mutation.isLoading || !name.changed}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("plan.create.submit.cta")}
          </button>
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="ghost"
            disabled={name.unchanged}
            onClick={bg.exec([name.clear, mutation.reset])}
            type="button"
          >
            {t("app.clear")}
          </button>
        </div>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.create.error")}
        </output>
      )}
    </form>
  );
}
