import { FreshContext } from "$fresh/server.ts";
import { getGitignoreFiles } from "$/common/gitignore.ts";
import type { GitignoreFile } from "$/common/gitignore.ts";

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

interface GitignoreItem {
  name: string;
  content: string;
}

export const handler = async (
  req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  let files: GitignoreFile[] = [];
  const items: GitignoreItem[] = [];

  try {
    files = await getGitignoreFiles();
    if (isDenoDeploy) {
      console.log("gitignore files");
      console.dir(files);
    }
  } catch (_e) {
    return new Response("Failed to retrieve gitignore list from GitHub", {
      status: 500,
    });
  }

  if (ctx.params.template) {
    const templates = ctx.params.template.split(",");
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];

      const item = files.find((item) =>
        item.name.toLocaleLowerCase() ===
          decodeURIComponent(template.toLocaleLowerCase())
      );
      if (!item) {
        items.push({
          name: templates[i],
          content: `### NOT FOUND: ${templates[i]} ###${
            i !== templates.length - 1 ? "\n\n" : ""
          }`,
        });
        continue;
      }

      let content = "";

      try {
        content = await Deno.readTextFile(item.path);
      } catch (_e) {
        return new Response(`Failed to read "${item.path}"`, {
          status: 500,
        });
      }

      const contentStr = `### ${item.name} ###\n${content}`;

      items.push({
        name: item.name,
        content: contentStr,
      });
    }
  }

  const { origin, searchParams } = new URL(req.url);

  let editUrl = `${origin}/?`;

  if (items.length) {
    editUrl += `templates=${items.map(({ name }) => name).join(",")}`;
  }

  if (searchParams.has("extras")) {
    if (items.length) {
      editUrl += "&";
    }
    editUrl += `extras=${searchParams.get("extras")}`;
  }

  const parts: string[] = [
    `# Created by ${req.url}\n# Edit at ${editUrl}\n`,
    items.map(({ content }) => content).join("\n")
  ];

  if (searchParams.has("extras")) {
    const extras = searchParams.get("extras")!.split(",");
    parts.push(`### Extras ###\n${extras.join("\n")}`);
  }

  const body = parts.join("\n");

  return new Response(body);
};
