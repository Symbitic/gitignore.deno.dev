/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { start } from "$fresh/server.ts";
import manifest from "$/fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "$/twind.config.ts";
import languagePlugin from "localekit_fresh";
import languageConfig from "$/translate.config.ts";
import { Gitignore } from "$/routes/_middleware.ts";

await Gitignore.init();

await start(manifest, {
  plugins: [
    twindPlugin(twindConfig),
    languagePlugin(languageConfig)
  ]
});
