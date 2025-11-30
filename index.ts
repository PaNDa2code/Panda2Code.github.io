declare global {
  var counter: number | undefined;
}

globalThis.counter = globalThis.counter ?? 0;
globalThis.counter += 1;

Bun.serve({
  port: Bun.env.PORT,
  routes: {
    "/": async (_req) => {
      const compressed = await compressedHtmlfile("./src/index.html");
      return new Response(compressed, {
        headers: {
          "Content-Type": "text/html",
          "Content-Encoding": "zstd",
        }
      });
    },
  },
});


async function compressedHtmlfile(path: string): Promise<Buffer> {
  const file = Bun.file(path);
  const data = await file.bytes();
  return Bun.zstdCompress(data);
}

const liveReloadScript = `
<script>
  new EventSource("/__bun_live_reload").onmessage = () => {
    location.reload();
  };
</script>
`;

type Fetch = (req: Request) => Promise<Response>;
export function withHtmlLiveReload(handler: Fetch): Fetch {
  return async (req) => {
    const response = await handler(req);
    const htmlText = await response.text();
    const newHtmlText = htmlText + liveReloadScript;
    return new Response(newHtmlText, { headers: response.headers });
  };
}

