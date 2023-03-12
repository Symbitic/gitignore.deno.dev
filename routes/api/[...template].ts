import { HandlerContext } from "$fresh/server.ts";
import { getGitignoreFiles } from "$/common/github.ts";
import type { GitHubFile } from "$/common/github.ts";

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  let contents: GitHubFile[] = [];
  let body = `# Created by ${req.url}\n`;
  body += `# Edit at ${
    req.url.replaceAll("?", "&").replace("/api/", "/?templates=")
  }\n\n`;

  try {
    contents = await getGitignoreFiles();
  } catch (_e) {
    return new Response("Failed to retrieve gitignore list from GitHub", {
      status: 500,
    });
  }

  if (ctx.params.template) {
    const c = new Intl.Collator("en", { ignorePunctuation: true });
    const templates = ctx.params.template.split(",");
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];

      // TODO: get capitalized name from API.
      const item = contents.find((item) =>
        // TODO: since toLowerCase() is needed anyway, is Collator needed?
        c.compare(item.name.toLowerCase(), template.toLowerCase()) === 0
      );
      if (!item) {
        // TODO: return error.
        continue;
      }

      let content = "";

      try {
        const response = await fetch(item.downloadUrl);
        content = await response.text();
      } catch (_e) {
        return new Response(`Failed to download ${item.downloadUrl}`, {
          status: 500,
        });
      }

      body += `### ${item.name} ###\n`;
      body += content;

      if (i !== templates.length - 1) {
        body += "\n";
      }
    }
  }

  const { searchParams } = new URL(req.url);

  if (searchParams.has("extra")) {
    const extras = searchParams.get("extra")!.split(",");
    body += "\n### Extras ###\n";
    for (const line of extras) {
      body += `${line}\n`;
    }
  }

  return new Response(body);
};
