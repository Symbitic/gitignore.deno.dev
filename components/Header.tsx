import { GitHubIcon } from "$/components/GitHubIcon.tsx";
import data from "$/translations/en-US.json" with { type: "json" };

export default function Header(props: { class?: string }) {
  return (
    <header
      class={`fixed top-0 left-0 right-0 bg-blue-700 py-4 flex justify-between items-center ${
        props.class ?? ""
      }`}
    >
      <h1 class="text-white font-bold ml-4">
        <a href="/">{data.site.title}</a>
      </h1>
      <a href={data.site.github}>
        <GitHubIcon class="fill-current text-white mr-4" />
      </a>
    </header>
  );
}
