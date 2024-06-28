import { FreshContext } from "$fresh/server.ts";
import { GitignoreFile, getGitignoreFiles } from "$/common/gitignore.ts"

export interface State {
  files: GitignoreFile[];
}

export class Gitignore {
  public static files: GitignoreFile[] = [];

  public static async init() {
    Gitignore.files = await getGitignoreFiles();
  }
}

export async function handler(
  _req: Request,
  ctx: FreshContext<State>,
) {
  ctx.state.files = Gitignore.files;
  const response = await ctx.next();
  return response;
}
