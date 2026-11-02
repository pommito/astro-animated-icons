import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(process.argv[2]);
createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  if (pathname === "/proof-harness/") {
    response.setHeader("Content-Type", "text/html");
    response.end('<!doctype html><html lang="en"><head><title>Recipe delivery proof harness</title></head><body></body></html>');
    return;
  }
  const filename = resolve(root, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
  if (!filename.startsWith(root + "/")) {response.writeHead(403);response.end();return;}
  try {
    const body = await readFile(filename);
    const type = filename.endsWith(".js") ? "text/javascript" : filename.endsWith(".json") ? "application/json" : filename.endsWith(".css") ? "text/css" : "text/html";
    response.setHeader("Content-Type", type);
    response.end(body);
  } catch { response.writeHead(404); response.end(); }
}).listen(Number(process.env.PORT ?? 45343), "127.0.0.1", function () {
  console.log("Recipe proof: http://127.0.0.1:" + this.address().port);
});
