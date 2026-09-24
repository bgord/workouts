export const Form = {
  category: { field: { name: "category" } },
  name: { field: { name: "name" } },
  default: { category: undefined, name: undefined },
  isDefault: (search: { category?: string; name?: string }): boolean =>
    search.category === Form.default.category && search.name === Form.default.name,
  validate: (value: Record<string, unknown>): { category: string | undefined; name: string | undefined } => ({
    category:
      typeof value["category"] === "string" && value["category"] !== ""
        ? value["category"]
        : Form.default.category,
    name: typeof value["name"] === "string" && value["name"] !== "" ? value["name"] : Form.default.name,
  }),
};
