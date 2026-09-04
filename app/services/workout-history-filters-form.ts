export const Form = {
  section: { field: { name: "section" } },
  default: { section: undefined },
  isDefault: (search: { section?: string }): boolean => search.section === Form.default.section,
};
