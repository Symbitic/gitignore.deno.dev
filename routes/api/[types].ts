import { HandlerContext } from "$fresh/server.ts";

export const handler = (req: Request, _ctx: HandlerContext): Response => {
  let header = `# Created by ${req.url}\n`;
  header += `# Edit at ${req.url.replaceAll("?", "&").replace("/api/", "/?templates=")}\n`;

  const body = header
    //+ Object.entries(Deno.env.toObject()).map(([a, b]) => `${a} = ${b}`).join("\n")
    //+ Object.entries(_ctx.state).map(([a, b]) => `${a} = ${b}`).join("\n")
    ;

  //for (const k in Deno.env) {}
  return new Response(body);
};
