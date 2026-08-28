import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function buildCoordinate() {
  const supplied = process.env.GITHUB_SHA ?? process.env.BUILD_ID;
  if (supplied) return supplied.slice(0, 7);
  try {
    return execFileSync("git", ["rev-parse", "--short=7", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "source";
  }
}

export default defineConfig({
  root: resolve(__dirname),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "../dist/site"),
    emptyOutDir: true,
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        demo: resolve(__dirname, "demo/index.html"),
        privacy: resolve(__dirname, "privacy/index.html"),
        terms: resolve(__dirname, "terms/index.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
  plugins: [{
    name: "build-coordinate",
    transformIndexHtml(html) {
      return html.replaceAll("%BUILD_ID%", buildCoordinate());
    },
  }],
});
