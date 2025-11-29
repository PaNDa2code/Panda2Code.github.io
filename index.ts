Bun.serve({
  port: 8000,
  fetch: (_req) => {
    return new Response("Hello, World!");
  }
});
