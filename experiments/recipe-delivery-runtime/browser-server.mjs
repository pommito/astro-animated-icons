import {createServer} from "node:http";
import {readFile,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
const root=fileURLToPath(new URL("../../",import.meta.url));
const serve=(port,directory)=>createServer(async(request,response)=>{
 const path=new URL(request.url,"http://localhost").pathname;
 response.setHeader("Access-Control-Allow-Origin","*");response.setHeader("Timing-Allow-Origin","*");
 const file=resolve(directory,"."+path+(path.endsWith("/")?"index.html":""));
 if(!file.startsWith(directory+"/")){response.writeHead(403);response.end();return;}
 try{const body=await readFile(file);response.setHeader("Content-Type",file.endsWith(".js")?"text/javascript":file.endsWith(".json")?"application/json":"text/html");response.setHeader("Cache-Control",file.includes("/_astro/")?"public,max-age=31536000,immutable":"no-store");response.end(body);}catch{response.writeHead(404);response.end();}
}).listen(port,"127.0.0.1");
serve(45343,resolve(root,".artifacts/page-loading/minimal-dist"));
serve(45344,resolve(root,".artifacts/recipe-delivery-v2/minimal-dist"));
createServer(async(request,response)=>{
 const path=new URL(request.url,"http://localhost").pathname;
 response.setHeader("Cache-Control","no-store");
 if(path==="/results"&&request.method==="POST"){
  const chunks=[];for await(const chunk of request)chunks.push(chunk);
  const data=Buffer.concat(chunks);JSON.parse(data);
  await writeFile(resolve(root,".artifacts/recipe-delivery-runtime/browser.json"),data);
  response.end("saved");return;
 }
 if(path==="/probe.js"){response.setHeader("Content-Type","text/javascript");response.end(await readFile(new URL("./browser-probe.js",import.meta.url)));return;}
 if(path==="/controller.js"){response.setHeader("Content-Type","text/javascript");response.end(await readFile(new URL("./browser-controller.js",import.meta.url)));return;}
 response.setHeader("Content-Type","text/html");response.end('<!doctype html><html lang="en"><head><title>Recipe preparation benchmark</title><script src="/controller.js" defer></script></head><body></body></html>');
}).listen(45345,"127.0.0.1",()=>console.log("Browser benchmark controller: http://127.0.0.1:45345/"));
