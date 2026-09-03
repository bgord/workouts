export const Form = {
  category: { field: { name: "category" } },
  name: { field: { name: "name" } },
  default: { category: "", name: "" },
  isDefault: (search: { category: string; name: string }): boolean =>
    search.category === Form.default.category && search.name === Form.default.name,
};
