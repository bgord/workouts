export const Form = {
  month: { field: { name: "month" } },
  default: { month: undefined },
  isDefault: (search: { month?: string }): boolean => search.month === Form.default.month,
};
