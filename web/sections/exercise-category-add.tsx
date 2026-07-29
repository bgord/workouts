import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-category-add-form";
import { workbookRoute } from "../router";

export function ExerciseCategoryAdd() {
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: () => router.invalidate({ filter: (r) => r.id === workbookRoute.id, sync: true }),
  });

  return (
    <section data-gap="5" data-stack="y">
      <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit}>
        <div data-cross="center" data-gap="3" data-stack="x">
          <label className="c-label" data-m="0" {...name.label.props}>
            Exercise category
          </label>
          <input
            className="c-input"
            placeholder="Upper Chest"
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
            Create
          </button>
          {name.changed && (
            <button
              className="c-button"
              data-variant="bare"
              onClick={bg.exec([name.clear, mutation.reset])}
              type="button"
            >
              Clear
            </button>
          )}
        </div>

        {mutation.isError && (
          <output data-color="danger-400" data-fs="sm">
            Could not create the exercise category
          </output>
        )}
      </form>
    </section>
  );
}
