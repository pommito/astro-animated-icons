import {readFileSync,writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const root=process.argv[2]??fileURLToPath(new URL("../../",import.meta.url));
const read=p=>JSON.parse(readFileSync(root+"/"+p,"utf8"));
const baseline=read(".artifacts/page-loading/baseline.json");
const first=read(".artifacts/recipe-delivery/proof.json");
const current=read(".artifacts/recipe-delivery-v2/proof.json");
const browser=read(".artifacts/recipe-delivery-v2/browser.json");
const validation=readFileSync(root+"/.artifacts/recipe-delivery-v2/validation.txt","utf8");
if(!/# pass 108/.test(validation)||!/# fail 0/.test(validation))throw Error("Production validation has not passed");
const cases=["paint-eye-off","one","repeated","all","repeated-all","path-paint","path-paint-repeated","path-paint-loader","unused"];
const rows=Object.entries(current.modes).flatMap(([mode,m])=>cases.map(name=>`| ${mode} | ${name} | ${baseline.modes[mode].routes[name].page.gzip} | ${first.modes[mode].routes[name].page.gzip} | ${m.routes[name].page.gzip} | ${m.routes[name].deltaPageGzip} |`)).join("\n");
const modes=Object.fromEntries(Object.entries(current.modes).map(([mode,m])=>[mode,{
 routes:Object.fromEntries(Object.entries(m.routes).map(([name,r])=>[name,{baseline:{page:baseline.modes[mode].routes[name].page,html:baseline.modes[mode].routes[name].html,files:baseline.modes[mode].routes[name].javascriptFiles},first:{page:first.modes[mode].routes[name].page,files:first.modes[mode].routes[name].javascriptFiles},bounded:{page:r.page,html:r.html,javascript:r.javascript,files:r.javascriptFiles,references:r.references},delta:r.deltaPageGzip}])),
 warm:m.warm.map(r=>({from:r.from,to:r.to,before:baseline.modes[mode].warm.find(b=>b.from===r.from&&b.to===r.to).page,after:r.page,newExternalFiles:r.requested.length})),
 distribution:{improved:Object.values(m.routes).filter(r=>r.deltaPageGzip<0).length,unchanged:Object.values(m.routes).filter(r=>r.deltaPageGzip===0).length,regressed:Object.values(m.routes).filter(r=>r.deltaPageGzip>0).length},
}]));
writeFileSync(root+"/docs/history/2026-11-02-bounded-recipe-delivery-payloads.json",JSON.stringify({reference:current.reference,environment:current.environment,assumptions:current.assumptions,modes})+"\n");
writeFileSync(root+"/docs/history/2026-11-02-bounded-recipe-delivery-browser.json",JSON.stringify(browser,null,2)+"\n");
const report=`# Bounded recipe delivery proof

The second proof removes the fixed transfer overhead and the adjacent-copy regression in the measured matrix. Each consumer has one improved composition, 548 byte-identical compositions and zero regressions. Production remains unchanged at \`90302b37876ba25f417b63ffd721fbab5e21f0aa\`. This is a proposed architecture, not an integrated loading change.

The minimal EyeOff page returns to 3979 gzip bytes. The three-copy catalogue returns to 51885. The large repeated paint page falls from 186794 to 162686, a 24108-byte saving. The [first proof](2026-11-02-recipe-delivery-proof.md) saved 36116 bytes on that large case. This version gives up 12008 bytes of that saving to keep the original runtime on ordinary pages and retain a bootstrap inside every independent reference clone.

## Measurements

The reference and package sources are unchanged. The same production fixture and minimal consumer each cover 549 identical compositions. Node v22.20.0, pnpm 12.5.1, Astro 7.3.8, Motion 13.5.1, TypeScript 6.0.3 and Apple M1 Pro on darwin arm64 match the first proof. Cold totals gzip each external resource separately and HTML once, including inline data and CSS. Shared URLs count once. Warm transitions model cached external URLs and a new HTML response. Headers, network latency, Brotli, frame pacing and server render time are excluded.

All numbers below are complete-page gzip bytes. Delta is bounded proof minus reference.

| Consumer | Composition | Reference | First proof | Bounded proof | Delta |
| --- | --- | ---: | ---: | ---: | ---: |
${rows}

The large composition retains the original 89-candidate scope, including WindArrowDown on Motion. It contains 1760 CSS hosts, of which 1423 carry references in this proof. The three-copy catalogue contains 360 CSS hosts and no references. On the other 548 compositions per consumer, HTML, JavaScript URLs and JavaScript bodies match the reference byte for byte.

The large minimal composition reaches 12 JavaScript files instead of 11. Its one additional recovery module costs 2891 gzip bytes and is included in the total. Its HTML falls from 172581 to 145582 gzip bytes. Repeated module tags inside reference hosts are also included in HTML. There is no new module on a page without references.

For the modeled warm transition from path-paint to path-paint-repeated, the minimal transfer falls from 172581 to 148473 gzip bytes. That includes the first recovery-module fetch. The large page remains 35768 bytes larger than the preceding all-Motion page of 126918 bytes. The new saving removes about 40.3% of the original regression, not all of it.

The [payload record](2026-11-02-bounded-recipe-delivery-payloads.json) preserves every cold composition and warm transition for both consumers. The case counts are a test matrix, not a traffic-weighted estimate.

## Proposed architecture

Keep complete recipes and the original wrappers for the first instance, close repetitions and recipes shorter than their recovery representation. This path adds no registration helper, attribute or module. It renders the existing public SVG and uses the original processed registration entry.

The server-only delivery module tracks bytes in drawing content and serialized instance records. It omits unrelated page markup and sheets emitted once per recipe. It selects a reference only when the previous instance lies more than 32768 counted bytes away and the full attribute is larger than the reference with its module tag. The counter is local to the Astro request and has no per-icon family exceptions or repeat-count threshold. The fixture checks the real byte distance for every chosen reference.

A reference keeps the same SVG and JSON recovery URL. It also contains an external module script after the SVG, inside the custom-element host. Native clones keep this script when the source template disappears. The shared recovery helper still reads available complete records first, then fetches JSON only for unknown tags with no complete source record. Existing lifecycle, factories, decoding and stylesheet recovery stay unchanged.

The recovery module is bundled independently through Vite's \`?worker&url\` asset import and executed with \`type="module"\` in the document. No Worker is created. Independent bundling leaves the original client chunk graph unchanged on pages without references. It duplicates some factory/runtime code on the conditional path, which explains the smaller large-page saving. The browser fetches and evaluates the identical module URL once even though every independent reference host carries its script.

The production seam would remain inside the three CSS wrappers. A shared server delivery module would choose the representation. An internal named slot after the SVG in the common Icon renderer would carry the conditional module. The source recipes and generated JSON would still come from one maintained definition. Per-icon generated URL imports would replace the experiment's server-only URL map. No consumer prop, setup wrapper or public playback method is proposed.

## Why the policy changed

The first version replaced a full record with a URL on every repetition and loaded the enhanced helper on every page. It paid the helper cost on single-icon pages and introduced new URL strings where complete records already compressed well.

An initial conditional prototype counted one-off styles when estimating distance. It preserved ordinary pages, but small family repetitions activated a recovery module for only a few references. Four measured compositions regressed by roughly 2.8 to 3.2 kB. Removing one-off styles from the estimate avoids those unprofitable activations. A more conservative 64 kB trial also failed to amortize recovery in the largest case. These trials remain local evidence under \`.artifacts/recipe-delivery-v2/\`.

The chosen 32768-byte rule follows the gzip history window, but it does not prove a saving for every possible page. It ignores surrounding markup, uses request-local wrapper execution order and excludes the one-off CSS that could push a real record outside that window. It deliberately misses some opportunities. The counter and actual serialized output need further scrutiny for streaming or asynchronous rendering before production integration.

## Verification

- \`rtk proxy node experiments/recipe-delivery-v2/run.mjs\` built both consumers and checked all 549 compositions in each. It verifies unchanged SVG and CSS, complete records, exact recovery JSON, selected script entries, unused imports and actual reference distances greater than 32768 bytes.
- \`rtk proxy node experiments/recipe-delivery-v2/verify.mjs\` reports \`Verified 1098 whole-page budgets; 1096 pages retain byte-identical HTML and JavaScript.\` The same command against the saved one-off-style trial fails with \`page gzip regressed by 3048 bytes\`. The verifier does not select a fallback output after measuring it.
- \`rtk proxy node --test experiments/recipe-delivery-v2/delivery.test.mjs\` passes four focused tests for adjacent repetitions, long intervening drawings, small recipes and separate requests.
- A strict \`tsc --ignoreConfig --noEmit\` check passes for the server delivery module. The full command is in the experiment README.
- \`rtk pnpm validate\` passes all 108 production tests, 470 drawings, 944 bundle cases and 120 migrated recipes across 132 compositions. It takes 150.709 seconds. Production source and inventory decisions are unchanged.

Chrome 154 runs the [native clone harness](../../experiments/recipe-delivery-v2/harness.mjs) with 240 clones across all 120 recipes. It removes their actual parsed source template before deferred bootstraps execute. It loads no recovery module by hand. The 86 referenced recipes fetch once each; the other 34 retain complete data. All 240 clones animate and finish their returns with no remaining animation. AirVent is initially discoverable only inside two nested inert templates. A late clone recovers a deleted stylesheet, reconnects and plays without another fetch. All 120 generated sheets are present, and the harness records no errors.

On the ordinary repeated-all page, all 360 hosts register with zero recovery-module and JSON requests. On the ordinary large repeated page, all 1780 hosts register. The 1423 reference hosts produce one recovery-module request and zero JSON requests. These observed resource counts complement the modeled byte totals. The [browser record](2026-11-02-bounded-recipe-delivery-browser.json) preserves the results.

## Limits and decision

The fixed cost removed here is transferred payload. The proof eagerly renders drawing slots and counts bytes on the server. Its CPU, memory and streaming effects have not been timed. The extra script nodes and discovery scan also add browser preparation work that has not been timed. The gzip result does not cover Brotli, unseen compositions, custom asset bases/CDNs or different build chunking. A remote duplicate on another page could still fail to amortize a recovery module. Zero regressions applies to this measured matrix.

Programmatic playback and native template parsing grant no owner visual acceptance. Safari, Firefox, real mouse/touch, real ClientRouter transitions, reduced motion, packed-package installation and frame pacing have not been rerun for this proof. Earlier production evidence retains its separate scope.

I would keep this conditional architecture for further review. It meets the requested payload goals in the tested compositions and preserves native source-removed clones. Before integration, review the server rendering cost, the locality estimate and the package asset generation. No production integration, commit or PR has been made.
`;
writeFileSync(root+"/docs/history/2026-11-02-bounded-recipe-delivery.md",report);
console.log("Saved bounded-delivery report, payload record and browser record.");
