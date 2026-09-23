import { createLink, type LinkComponent } from "@tanstack/react-router";

function ExerciseAnchor(props: React.JSX.IntrinsicElements["a"]) {
  return (
    <a
      data-color="neutral-100"
      data-fw="medium"
      data-hover-color="brand-300"
      data-transform="truncate"
      {...props}
    />
  );
}

const ExerciseAnchorLink = createLink(ExerciseAnchor);

export const ExerciseLink: LinkComponent<typeof ExerciseAnchor> = (props) => (
  <ExerciseAnchorLink activeProps={{}} {...props} />
);
