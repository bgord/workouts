type Background = React.JSX.IntrinsicElements["div"]["data-bg"];

export function Separator(props: { color?: Background }) {
  return <div data-bg={props.color ?? "neutral-800"} data-width="100%" style={{ height: "2px" }} />;
}
