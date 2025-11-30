import { minify } from "html-minifier-terser";

const output = await Bun.build({
  entrypoints: ["src/index.html"],
  outdir: "./dist",
  target: "browser",
  sourcemap: "none",
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
    keepNames: false,
  },
});

const htmlCode = await Bun.file("dist/index.html").text();

const minified = await minify(htmlCode, {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
});

await Bun.write("dist/index.html", minified);

console.log("Build complete!");
