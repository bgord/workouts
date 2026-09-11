export function Select(props: React.JSX.IntrinsicElements["select"]) {
  return (
    <div className="c-select-wrapper" data-md-width="100%">
      <select className="c-select" data-md-width="100%" {...props} />
    </div>
  );
}
