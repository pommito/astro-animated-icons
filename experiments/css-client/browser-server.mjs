import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const directories = ["page-loading/minimal-dist", "css-client/attribute/minimal/dist", "css-client/template/minimal/dist"];
const offset = Number(process.env.CSS_BENCHMARK_PORT ?? 45390);
for (const [index, directory] of directories.entries()) {
  const base = join(root, ".artifacts", directory);
  createServer(async (request, response) => {
    const path = new URL(request.url, "http://localhost").pathname;
    const file = resolve(base, "." + path + (path.endsWith("/") ? "index.html" : ""));
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Timing-Allow-Origin", "*");
    if (!file.startsWith(base + "/")) { response.writeHead(403); response.end(); return; }
    try {
      const body = await readFile(file);
      response.setHeader("Content-Type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/html");
      response.setHeader("Cache-Control", file.includes("/_astro/") ? "public,max-age=31536000,immutable" : "no-store");
      response.end(body);
    } catch { response.writeHead(404); response.end(); }
  }).listen(offset + index, "127.0.0.1");
}
const names = ["one", "cog", "key-square", "paint-eye-off", "four", "ten", "repeated", "all", "repeated-all", "path-paint-repeated"];
createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const transport = url.pathname.startsWith("/template/") || url.searchParams.get("transport") === "template" ? "template" : "attribute";
  response.setHeader("Cache-Control", "no-store");
  if (url.pathname === "/results" && request.method === "POST") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    JSON.parse(body);
    await writeFile(join(root, ".artifacts/css-client", transport, "runtime/browser-run-1.json"), body);
    response.end("saved"); return;
  }
  if (url.pathname === "/probe.js") {
    response.setHeader("Content-Type", "text/javascript");
    response.end(await readFile(join(root, "experiments/recipe-delivery-runtime/browser-probe.js"))); return;
  }
  if (url.pathname.endsWith("/controller.js")) {
    let source = await readFile(join(root, "experiments/recipe-delivery-runtime/browser-controller.js"), "utf8");
    source = source.replace(/const scenarios=\[[^\n]+\];/, "const scenarios=" + JSON.stringify(names) + ";")
      .replace('baseline:"http://127.0.0.1:45343",proof:"http://127.0.0.1:45344"', `baseline:"http://127.0.0.1:${offset}",proof:"http://127.0.0.1:${offset + (transport === "attribute" ? 1 : 2)}"`)
      .replace('fetch("/results",', `fetch("/results?transport=${transport}",`);
    response.setHeader("Content-Type", "text/javascript"); response.end(source); return;
  }
  response.setHeader("Content-Type", "text/html");
  response.end(`<!doctype html><html lang="en"><head><title>CSS client preparation</title><script src="/${transport}/controller.js" defer></script></head><body></body></html>`);
}).listen(offset + 3, "127.0.0.1", () => console.log("CSS preparation controller http://127.0.0.1:" + (offset + 3)));
