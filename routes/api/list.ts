import { getGitignoreFiles } from "$/common/gitignore.ts";
import type { FreshContext } from "$fresh/server.ts";

/** Return a list of every supported gitignore template. */
export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
  try {
    const data = await getGitignoreFiles();

    // Remove filesystem data.
    const body = data.map(({ name }) => ({
      name,
      path: `gitignore/${name}.gitignore`
    }));

    return new Response(JSON.stringify(body));
  } catch (_e) {
    return new Response(undefined, { status: 500 })
  }
};
