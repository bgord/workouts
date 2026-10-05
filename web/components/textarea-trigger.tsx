export function TextareaTrigger(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <button
      className="c-textarea"
      data-bc="alpha-subtle"
      data-cursor="pointer"
      data-hover-bc="alpha-medium"
      data-shadow="none"
      data-stack="y"
      data-ta="start"
      data-transform="pre-line"
      type="button"
      {...props}
    />
  );
}
