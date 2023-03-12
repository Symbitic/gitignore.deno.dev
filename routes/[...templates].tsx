import { PageProps } from "$fresh/server.ts";

export default function Edit(props: PageProps) {
  return <div>Hello {Object.keys(props.params)} - {props.params.templates}</div>;
}
