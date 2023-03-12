import { getGitignoreFiles } from "$/common/github.ts";
import type { HandlerContext } from "$fresh/server.ts";

/** Return a list of every supported gitignore template. */
export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  try {
    const data = await getGitignoreFiles();
    const body = data.map(({ name }) => name);
    return new Response(JSON.stringify(body));
  } catch (_e) {
    return new Response(undefined, { status: 500 })
  }
};
