import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const GH_USER = "panda2code";
const GH_TOKEN = process.env.GH_TOKEN;
const OUTPUT_DIR = "dist";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pins.json");

const PinnedReposSchema = z.object({
  data: z.object({
    user: z.object({
      pinnedItems: z.object({
        edges: z.array(
          z.object({
            node: z.object({
              name: z.string(),
              description: z.string().nullable(),
              url: z.string().url(),
              stargazers: z.object({
                totalCount: z.number(),
              }),
              forks: z.object({
                totalCount: z.number(),
              }),
              primaryLanguage: z.object({
                name: z.string(),
                color: z.string(),
              }).nullable(),
            }),
          })
        ),
      }),
    }),
  }),
});

async function fetchPinnedRepos() {
  if (!GH_TOKEN) {
    throw new Error("GH_TOKEN environment variable not set.");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          user(login: "${GH_USER}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    url
                    stargazers {
                      totalCount
                    }
                    forks {
                      totalCount
                    }
                    primaryLanguage {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const json = await response.json();
  const validatedData = PinnedReposSchema.parse(json);

  const projects = validatedData.data.user.pinnedItems.edges.map(({ node }) => ({
    name: node.name,
    description: node.description,
    url: node.url,
    stars: node.stargazers.totalCount,
    forks: node.forks.totalCount,
    language: node.primaryLanguage,
  }));

  return projects;
}

async function main() {
  try {
    console.log("Fetching pinned repositories...");
    const projects = await fetchPinnedRepos();

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(projects, null, 2));

    console.log(`Successfully saved ${projects.length} pinned repositories to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error fetching or saving pinned repositories:", error);
    process.exit(1);
  }
}

main();
