import Logo from "$/components/Logo.tsx";
import SearchBar from "$/islands/SearchBar.tsx";
import { getGitignoreFiles } from "$/common/gitignore.ts";
import type { Handlers, PageProps } from "$fresh/server.ts";
import type { GitignoreFile } from "$/common/gitignore.ts";

export const handler: Handlers<GitignoreFile[]> = {
  async GET(_req, ctx) {
    try {
      const data = await getGitignoreFiles();
      return ctx.render(data);
    } catch (_e) {
      return new Response("Failed to retrieve gitignore list from GitHub", {
        status: 500,
      });
    }
  },
};

export default function Home({ data }: PageProps<GitignoreFile[]>) {
  return (
    <div class="flex flex-col items-center justify-center h-screen">
      <Logo color="#1D4ED8" class="h-14" />
      <h2 class="text-sm font-medium text-center">
        Generate custom .gitignore files from templates
      </h2>
      <div class="flex items-center mt-10 flex-wrap w-4/12">
        <SearchBar items={data} />
      </div>
    </div>
  );
}
