import { writeFileSync } from "node:fs";
import { measureRoute } from "./measure-css-pilot.mjs";

const cases = {
  folder: ["folder-motion-single", "folder-single"],
  "folder-file-text": ["folder-motion-file-text", "folder-file-text-combined"],
};
const result = {
  node: process.version,
  compression: "Node zlib defaults per unique reachable JS chunk and style source; cold cache; HTML, headers and Brotli excluded; inline CSS compressed separately as an estimate",
  cases: Object.fromEntries(Object.entries(cases).map(([name, routes]) => {
    const [motion, css] = routes.map(route => measureRoute(route + "/index.html"));
    return [name, { motion, css, saved: { raw: motion.total.raw - css.total.raw, gzip: motion.total.gzip - css.total.gzip } }];
  })),
};
const json = JSON.stringify(result, null, 2) + "\n";
if (process.env.FOLDER_RESULT) writeFileSync(process.env.FOLDER_RESULT, json);
console.log(json);
