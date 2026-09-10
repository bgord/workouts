export function Kbd(props: { keys: string }) {
  return (
    <kbd data-cross="center" data-gap="1" data-stack="x">
      {props.keys.split(" ").map((key) => (
        <span
          data-bc="alpha-soft"
          data-bg="alpha-subtle"
          data-br="sm"
          data-bs="solid"
          data-bw="hairline"
          data-color="neutral-300"
          data-ff="mono"
          data-fs="xs"
          data-lh="snug"
          data-px="1"
          data-py="0-5"
          key={key}
        >
          {key}
        </span>
      ))}
    </kbd>
  );
}
