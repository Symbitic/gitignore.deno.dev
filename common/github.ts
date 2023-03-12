export interface GitHubFile {
  name: string;
  path: string;
  type: string;
  downloadUrl: string;
}

export async function getGitignoreFiles(): Promise<GitHubFile[]> {
  const query = `
    query {
      repository(owner: "toptal", name: "gitignore") {
        object(expression: "HEAD:templates") {
          ... on Tree {
            entries {
              name
              path
              type
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("GITHUB_API_TOKEN")}`,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  const files: GitHubFile[] = data.repository.object.entries
    .filter((item: GitHubFile) =>
      item.type === "blob" && item.name.endsWith(".gitignore")
    )
    .map((item: GitHubFile) => ({
      name: item.name.replace(/\.gitignore$/, ""),
      path: item.path,
      type: item.type,
      downloadUrl: `https://github.com/toptal/gitignore/raw/HEAD/templates/${item.name}`,
    }));

  return files;
}
