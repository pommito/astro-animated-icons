import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { measureProofRoute } from "./measure-path-paint-proof.mjs";
import plans from "../tests/helpers/path-paint-proof-plans.json" with { type: "json" };

test("proof delivery rejects a changed serialized plan and a hidden Motion dependency", () => {
  const directory=mkdtempSync(join(tmpdir(),"paint-proof-delivery-"));
  const output=pathToFileURL(directory+"/");
  try {
    mkdirSync(join(directory,"proof-loading/paint-at-sign"),{recursive:true});
    mkdirSync(join(directory,"assets"));
    writeFileSync(join(directory,"assets/runtime.js"),'export const selector="data-pp-recipe";');
    const metadata={"/assets/runtime.js":{modules:[{id:"fixture/path-paint-proof/register.ts"}]}};
    const page=plan=>'<html><head><style data-grave-cycle-style="proof-paint-at-sign">@keyframes proof{}</style></head><body><proof-path-at-sign data-pp-recipe="'+JSON.stringify(plan).replaceAll('"',"&quot;")+'"><svg></svg></proof-path-at-sign><script type="module" src="/assets/runtime.js"></script></body></html>';
    const file=join(directory,"proof-loading/paint-at-sign/index.html");
    writeFileSync(file,page(plans["at-sign"]));
    assert.equal(measureProofRoute(output,"paint-at-sign",metadata).javascriptFiles,1);
    writeFileSync(file,page({...plans["at-sign"],finish:"restore"}));
    assert.throws(()=>measureProofRoute(output,"paint-at-sign",metadata),/serialized proof recipe matches/);
    writeFileSync(file,page(plans["at-sign"]));
    metadata["/assets/runtime.js"].modules.push({id:"node_modules/motion/dist/es/index.mjs"});
    assert.throws(()=>measureProofRoute(output,"paint-at-sign",metadata),/excludes Motion/);
  } finally { rmSync(directory,{recursive:true,force:true}); }
});
