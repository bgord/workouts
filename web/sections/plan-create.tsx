import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-create-form";
import * as ui from "../components";
import { plansRoute } from "../router";

export function PlanCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = plansRoute.useNavigate();
  const { plans } = plansRoute.useLoaderData();

  const planCreate = bg.useToggle({ name: "plan-create" });

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/plans/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async (response, context) => {
      const { id } = await response.json();

      planCreate.disable();
      name.clear();
      context.form?.reset();

      await navigate({ params: { planId: id }, to: "/plans/$planId" });
      await router.invalidate({ filter: (match) => match.routeId === plansRoute.id, sync: true });
    },
  });

  return (
    <>
      <ui.ActionHint {...plans.actions.create} data-md-width="100%" />

      <button
        className="c-button"
        data-md-width="100%"
        data-variant="primary"
        disabled={!plans.actions.create.enabled}
        onClick={planCreate.enable}
        type="button"
        {...planCreate.props.controller}
      >
        <Plus data-size="sm" />
        {t("plan.create.cta")}
      </button>

      <ui.Dialog {...planCreate}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planCreate.disable}>
          {t("plan.create.cta")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          <div data-stack="y" {...ui.Gap.field}>
            <label {...name.label.props}>{t("plan.create.name.label")}</label>

            <input
              className="c-input"
              data-width="100%"
              placeholder={t("plan.create.name.placeholder")}
              {...bg.Form.input(Form.name.pattern)}
              {...name.input.props}
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("plan.create.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={planCreate.disable}>
            <button
              className="c-button"
              data-variant="primary"
              disabled={name.empty || mutation.isLoading}
              type="submit"
            >
              <Plus data-size="sm" />
              {t("plan.create.submit.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
