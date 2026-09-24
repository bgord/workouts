export const Form = {
  month: { field: { name: "month" } },
  default: { month: undefined },
  isDefault: (search: { month?: string }): boolean => search.month === Form.default.month,
  validate: (value: Record<string, unknown>): { month?: string } => ({
    month:
      typeof value["month"] === "string" && /^\d{4}-\d{2}$/.test(value["month"])
        ? value["month"]
        : Form.default.month,
  }),
};
