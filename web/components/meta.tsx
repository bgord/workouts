export function Meta(props: React.JSX.IntrinsicElements["div"] & { truncate?: boolean }) {
  const { truncate, ...rest } = props;

  return (
    <div
      data-color="neutral-500"
      data-fs="xs"
      data-transform={truncate ? "truncate" : "font-variant-numeric"}
      {...rest}
    />
  );
}
