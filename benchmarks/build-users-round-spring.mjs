import { copyFileSync, existsSync, mkdirSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../scripts/measure-page-loading.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const project = join(root, ".artifacts/users-round-spring");
const pages = join(project, "src/pages");
mkdirSync(pages, { recursive: true });
writeFileSync(join(project, "package.json"), '{"type":"module","private":true}\n');
if (!existsSync(join(project, "node_modules"))) {
  symlinkSync(join(root, "tests/fixtures/astro/node_modules"), join(project, "node_modules"), "dir");
}
copyFileSync(new URL("./users-round-spring.astro", import.meta.url), join(pages, "index.astro"));
const config = join(project, "astro.config.mjs");
writeFileSync(config, "export default {};\n");
await build(project, config);
console.log("Built the UsersRound spring probe in .artifacts/users-round-spring/dist");
