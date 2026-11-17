import {readFileSync,writeFileSync,mkdirSync,existsSync,symlinkSync,rmSync} from "node:fs";
import {dirname,resolve,join} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {loadingIcons} from "../../scripts/page-loading-cases.mjs";
const dir=dirname(fileURLToPath(import.meta.url)),root=resolve(dir,"../..");
const artifacts=join(root,".artifacts/recipe-delivery-runtime"),project=join(artifacts,"ssr-project"),generated=join(project,"src/generated");
mkdirSync(join(project,"src/pages"),{recursive:true});rmSync(generated,{recursive:true,force:true});mkdirSync(generated,{recursive:true});
for(const folder of [artifacts,project])if(!existsSync(join(folder,"node_modules")))symlinkSync(join(root,"tests/fixtures/astro/node_modules"),join(folder,"node_modules"),"dir");
writeFileSync(join(project,"package.json"),'{"type":"module","private":true}\n');
const exports=[];
for(const icon of loadingIcons){
 const original=join(root,"packages/animated-icons/src/icons",icon.slug,icon.name+".astro");
 let source=readFileSync(original,"utf8");
 if(!/from ["'][^"']*\/Css(?:Opacity|Paint)?Icon\.astro["']/.test(source)){
  exports.push(`export {default as ${icon.name}} from ${JSON.stringify(original)};`);continue;
 }
 source=source.replace(/(from\s*["'])(\.[^"']+)(["'])/g,(_,prefix,specifier,suffix)=>{
  const file=resolve(dirname(original),specifier);
  const selected=/\/Css(?:Opacity|Paint)?Icon\.astro$/.test(file)?join(root,"experiments/recipe-delivery-v2",file.split("/").at(-1)):file;
  return prefix+selected+suffix;
 });
 writeFileSync(join(generated,icon.name+".astro"),source);
 exports.push(`export {default as ${icon.name}} from "./${icon.name}.astro";`);
}
writeFileSync(join(generated,"icons.ts"),exports.join("\n")+"\n");
writeFileSync(join(project,"src/Scene.astro"),`---\nimport * as baseline from "@grave/animated-icons/astro";\nimport * as proof from "./generated/icons";\nimport {loadingIcons} from ${JSON.stringify(pathToFileURL(join(root,"scripts/page-loading-cases.mjs")).href)};\nconst {variant,slugs}=Astro.props;\nconst icons=variant==="baseline"?baseline:proof;\nconst selected=slugs.map(slug=>loadingIcons.find(icon=>icon.slug===slug));\n---\n{selected.map(icon=>{const Component=icons[icon.name];return <Component/>;})}`);
writeFileSync(join(project,"src/pages/bench.astro"),`---\nimport {experimental_AstroContainer as AstroContainer} from "astro/container";\nimport Scene from "../Scene.astro";\nimport {runServerBenchmark} from ${JSON.stringify(pathToFileURL(join(dir,"server-benchmark.mjs")).href)};\nawait runServerBenchmark(Scene,${JSON.stringify(root)},AstroContainer);\n---\n<p>Server benchmark completed.</p>`);
writeFileSync(join(artifacts,"ssr.config.mjs"),`import {defineConfig} from "astro/config";\nexport default defineConfig({root:${JSON.stringify(project)},outDir:${JSON.stringify(join(artifacts,"ssr-dist"))},cacheDir:${JSON.stringify(join(artifacts,"ssr-cache"))},vite:{logLevel:"warn"}});\n`);
console.log("Prepared production-compiled paired SSR benchmark.");
