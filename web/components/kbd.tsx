export function Kbd(props: { keys: string }) {
  return (
    <span
      data-bg="brand-900"
      data-br="sm"
      data-color="brand-300"
      data-ff="mono"
      data-fs="xs"
      data-fw="medium"
      data-ls="wide"
      data-px="1"
    >
      {props.keys}
    </span>
  );
}
