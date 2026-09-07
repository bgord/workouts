import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
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
      <div data-cross="center" data-gap="3" data-stack="x">
        <label className="c-label" data-variant="inline" {...name.label.props}>
          {t("plan.create.name.label")}
        </label>

        <input
          className="c-input"
          placeholder={t("plan.create.name.placeholder")}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <button
          className="c-button"
          data-ml="2"
          data-variant="primary"
          disabled={mutation.isLoading}
          type="submit"
        >
          {t("plan.create.submit.cta")}
        </button>

        {name.changed && (
          <button
            className="c-button"
            data-variant="ghost"
            onClick={bg.exec([name.clear, mutation.reset])}
            type="button"
          >
            {t("app.clear")}
          </button>
        )}
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.create.error")}
        </output>
      )}
    </form>
  );
}
