export const Form = {
  section: { field: { name: "section" } },
  default: { section: "" },
  isDefault: (search: { section: string }): boolean => search.section === Form.default.section,
};
