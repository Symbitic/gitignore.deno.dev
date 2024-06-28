import { basename } from "@std/path/basename";
import { existsSync } from "@std/fs/exists";
import { resolve } from "@std/path/resolve";
import { walk, type WalkOptions } from "@std/fs/walk";

export interface GitignoreFile {
  path: string;
  name: string;
}

export async function getGitignoreFiles(): Promise<GitignoreFile[]> {
  const options: WalkOptions = {
    followSymlinks: true,
    exts: [".gitignore"]
  };

  if (!existsSync("gitignore")) {
    throw new Error("gitignore/ directory not found");
  }

  const files: GitignoreFile[] = [];
  for (const entry of await Array.fromAsync(walk("gitignore", options))) {
    const path = resolve(entry.path);
    const name = path
      .replace(/.*\/gitignore\//, "")
      .replace(".gitignore", "");
    files.push({ name: name, path: path });
  }
  return files
    .sort((a, b) => basename(a.path).localeCompare(basename(b.path)))
    .filter((a, i, arr) => arr.findIndex((b) => a.path === b.path) === i);
}
