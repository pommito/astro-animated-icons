import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, symlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build, captureClientModules } from "./measure-page-loading.mjs";
import { measureRoute } from "./measure-resources.mjs";
import { loadingCases } from "./page-loading-cases.mjs";
import plans from "../tests/helpers/path-paint-proof-plans.json" with { type: "json" };
import { htmlElements, decodeAttribute } from "./html.mjs";
import { decodePaint } from "../tests/fixtures/astro/src/path-paint-proof/codec.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const fixture = join(root,"tests/fixtures/astro");
const artifacts = join(root,".artifacts/path-paint-delivery");
const names = Object.keys(loadingCases).filter(name=>name.startsWith("paint-")||name.includes("path-reveal")||name==="path-paint"||name.startsWith("path-paint-"));

export function measureProofRoute(output, name, metadata) {
  const path = "proof-loading/"+name+"/index.html";
  const html = readFileSync(new URL(path,output),"utf8");
  const slugs = loadingCases[name];
  const expected = slugs.filter(slug=>slug in plans);
  assert.equal((html.match(/data-pp-recipe=/g)??[]).length,expected.length,name+": serialized proof recipe membership");
  assert.equal((html.match(/<svg\b/g)??[]).length,slugs.length,name+": complete source drawings");
  assert.equal((html.match(/data-grave-cycle-style="proof-paint-/g)??[]).length,new Set(expected).size,name+": deduplicated proof sheets");
  for(const node of htmlElements(html)) if(node.attributes?.["data-pp-recipe"]) {
    const slug=node.name.slice("proof-path-".length);
    assert.ok(expected.includes(slug),name+": unexpected proof recipe");
    assert.deepEqual(decodePaint(JSON.parse(decodeAttribute(node.attributes["data-pp-recipe"]))),plans[slug],name+": serialized proof recipe matches "+slug);
  }
  const measurement=measureRoute(path,{output,includePage:true});
  const sources=measurement.chunks.map(url=>readFileSync(new URL(url.slice(1),output),"utf8")).join("\n");
  assert.ok(!/reference-|react-dom/.test(sources),name+": no comparison references");
  const reachable = measurement.chunks.flatMap(url => {
    assert.ok(metadata[url],name+": missing module evidence");
    return metadata[url].modules;
  });
  if(slugs.every(slug=>slug in plans)) assert.ok(!reachable.some(module=>/node_modules\/(?:motion|motion-dom|motion-utils)\//.test(module.id)),name+": paint-only consumer excludes Motion");
  return {...measurement,javascriptFiles:measurement.chunks.length,icons:slugs.length,proofIcons:expected.length};
}

async function main() {
  const minimal=join(artifacts,"minimal");
  mkdirSync(join(minimal,"src/pages/proof-loading"),{recursive:true});
  writeFileSync(join(minimal,"package.json"),'{"private":true,"type":"module"}\n');
  for(const directory of [artifacts,minimal]) if(!existsSync(join(directory,"node_modules"))) symlinkSync(join(fixture,"node_modules"),join(directory,"node_modules"),"dir");
  const source=join(fixture,"src/pages/proof-loading/[sample].astro");
  writeFileSync(join(minimal,"src/pages/proof-loading/[sample].astro"),readFileSync(source,"utf8").replace(/from "(\.[^"]+)"/g,(_match,path)=>'from "'+pathToFileURL(join(dirname(source),path)).href+'"'));
  const modes={};
  for(const [name,directory] of Object.entries({full:fixture,minimal})) {
    const output=join(artifacts,name+"-dist");
    const config=join(artifacts,name+".config.mjs");
    const modules=join(artifacts,name+"-modules.json");
    writeFileSync(config,'import base from '+JSON.stringify(pathToFileURL(join(fixture,"astro.config.mjs")).href)+';\nimport {captureClientModules} from '+JSON.stringify(pathToFileURL(join(root,"scripts/measure-page-loading.mjs")).href)+';\nexport default {...base,root:'+JSON.stringify(directory)+',outDir:'+JSON.stringify(output)+',cacheDir:'+JSON.stringify(join(artifacts,name+"-cache"))+',vite:{...base.vite,plugins:[...(base.vite?.plugins??[]),captureClientModules('+JSON.stringify(modules)+')]}};\n');
    await build(directory,config);
    const metadata=JSON.parse(readFileSync(modules,"utf8"));
    modes[name]={routes:Object.fromEntries(names.map(route=>[route,measureProofRoute(pathToFileURL(output+"/"),route,metadata)])),modules:metadata};
  }
  writeFileSync(join(artifacts,"proof.json"),JSON.stringify({scope:"Fixture-only representation forecast using unchanged server-rendered production drawings; WindArrowDown remains Motion. Not a migrated production measurement.",assumptions:"Same measureRoute boundary as the fresh baseline: cold unique external URLs, Node zlib gzip defaults, HTML with inline CSS/data compressed once. No headers, latency, Brotli or frame-pacing claim. Minimal consumer contains only proof delivery routes.",modes},null,2)+"\n");
  console.log("Saved .artifacts/path-paint-delivery/proof.json");
}
if(process.argv[1]===fileURLToPath(import.meta.url)) main().catch(error=>{console.error(error);process.exitCode=1;});
