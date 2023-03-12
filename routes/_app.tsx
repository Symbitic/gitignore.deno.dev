import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import Header from "$/components/Header.tsx";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>gitignore.deno.dev - Generate .gitignore files</title>
        <meta name="description" content="gitignore generator" />
        <meta property="og:title" content="gitignore.deno.dev" />
        <meta property="og:description" content="gitignore generator" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="keywords" content="gitignore,.gitignore,git,deno,fresh" />
      </Head>
      <Header />
      <main class="mx-auto md:p-0 md:w-[100%]">
        <Component />
      </main>
    </>
  );
}
