import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-create-form";
import * as ui from "../components";
import { plansRoute } from "../router";

export function PlanCreate(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = plansRoute.useNavigate();
  const { toggle } = bg.extractUseToggle(props);

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

      toggle.disable();
      bg.Fields.clearAll([name]);
      context.form?.reset();

      await navigate({ params: { planId: id }, to: "/plans/$planId" });
      await router.invalidate({ filter: (route) => route.id === plansRoute.id, sync: true });
    },
  });

  return (
    <ui.Dialog data-md-mt="12" {...toggle}>
      <ui.DialogHeader disabled={mutation.isLoading} onClose={toggle.disable}>
        {t("plan.create.cta")}
      </ui.DialogHeader>

      <form aria-busy={mutation.isLoading} data-gap="6" data-stack="y" onSubmit={mutation.handleSubmit}>
        <div data-gap="1-5" data-stack="y">
          <label className="c-label" {...name.label.props}>
            {t("plan.create.name.label")}
          </label>

          <input
            className="c-input"
            data-variant="transparent"
            data-width="100%"
            placeholder={t("plan.create.name.placeholder")}
            {...bg.Form.input(Form.name.pattern)}
            {...name.input.props}
          />
        </div>

        {mutation.isError && <ui.DialogError>{t("plan.create.error")}</ui.DialogError>}

        <ui.DialogFooter disabled={mutation.isLoading} onCancel={toggle.disable}>
          <button
            className="c-button"
            data-variant="primary"
            disabled={name.unchanged || mutation.isLoading}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("plan.create.submit.cta")}
          </button>
        </ui.DialogFooter>
      </form>
    </ui.Dialog>
  );
}
