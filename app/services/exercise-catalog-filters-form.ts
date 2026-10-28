import * as bg from "@bgord/ui";

export const Form = {
  category: { field: { name: "category" } },
  name: { field: { name: "name" } },
  ...bg.SearchParam.form({ category: bg.SearchParam.text(), name: bg.SearchParam.text() }),
};
