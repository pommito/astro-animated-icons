---
status: rejected
decision_date: 2026-11-17
---

# Reject the two repeated prepared-record transports

Issue [#110](https://github.com/pommito/astro-animated-icons/issues/110) requires a smaller CSS client with synchronous playback and independent recovery. Two executable transports meet the proposed JavaScript byte reductions. Both increase complete-page transfer, server work and browser preparation on repeated and combined compositions. On 2026-11-17, the owner rejected both transports for production and authorized archiving the results in [PR #122](https://github.com/pommito/astro-animated-icons/pull/122).

The proofs used the selective transform implementation at `9a5a81f` as their reference. The [proof guide](../../experiments/css-client/README.md) gives the commands. The [evidence report](../history/2026-11-02-prepared-css-client.md) links raw samples, graphs, payloads and comparisons.

## Candidate interfaces

Both candidates derive a prepared record from the maintained `cycle.ts`, `parts.ts` or `paint.ts`. The record contains playback data and exact recovery CSS. Combined transforms also carry base and unit-deviation samples for both phases. Paint carries the decoded plan, so its browser client needs neither the CSS compiler nor compact codec.

The server caches each prepared record once per recipe in request-local state. Each rendered host carries a complete copy. Active styles still render once per recipe. The SVG, public tag, props and manual handles stay unchanged. No consumer integration, engine prop or catalogue registry is added.

| Candidate | Transport | Recovery |
| --- | --- | --- |
| Attribute | The mechanism's recipe attribute holds the complete prepared record, including CSS and combined samples. | Discovery parses that attribute before defining the tag. Connection and playback insert the prepared CSS text when the active sheet is missing. |
| Inert template | The host attribute holds playback data. A template inside each host holds CSS text and an attribute with combined samples. | Discovery reads the inert content before defining the tag. A native clone retains the template. The same document-scoped sheet helper inserts its CSS and reconciles late sheets. |

The lifecycle, triggers and native transform playback remain shared. Derived opacity/paint/combined adapters inject prepared recovery into the production mechanisms. Paint still measures geometry at playback. Combined interruption computes scalar frames from prepared base/weight data and interpolates at native current time. No browser Bezier solver or CSS compiler is loaded initially, on first playback or during recovery.

Class definition happens after the complete record has been read. `startAnimation()` and `stopAnimation()` remain synchronous and return `void` immediately after `whenDefined`. Neither proof adds an asynchronous dependency or a first-playback fetch. Existing controls cover early/late clones, source removal, deleted sheets, nested inert templates, reconnect and real Astro navigation.

## Measured decision

The following values are JavaScript gzip bytes in the minimal consumer. All four proposed raw and gzip targets also pass in the full consumer. These byte targets are still proposals from #108. The exact release ceilings include file counts, complete pages and warm transitions, which these candidates do not satisfy.

| Mechanism | #108 | Attribute | Template | Proposed ceiling |
| --- | ---: | ---: | ---: | ---: |
| Opacity, CircleDashed | 2491 | 1765 | 1831 | 1991 |
| Simple, UserRoundCog | 2794 | 1793 | 1859 | 1994 |
| Combined, KeySquare | 2794 | 2203 | 2269 | 2394 |
| Paint, EyeOff | 2991 | 2387 | 2451 | 2491 |

Complete-page gzip changes the decision. Both candidates reduce the four-icon page, but repeat recovery data with every host. Compared with #108, the attribute transport adds 921 bytes to twenty CircleDashed instances and 33,282 bytes to the 120-recipe catalogue. The template transport adds 580 and 32,988 bytes respectively. KeySquare adds 3,689 or 6,302 bytes because prepared scalar samples and recovery CSS move into HTML. The linked reports include every full/minimal route and warm transition, including retained Motion mixtures.

Two independent server processes per transport use five warmup pairs and thirty measured pairs per scenario. Streaming uses separate runs. Chrome uses three warmup pairs and twenty measured pairs with fresh visible documents, warm assets and at most twenty matched launch hosts. The campaign ran after Motion #112 became idle and with own builds and functional probes stopped.

For the complete catalogue, median server rendering rises from 6.266 to 11.346 ms with attributes and from 6.194 to 9.708 ms with templates. The corresponding 95% intervals for the difference of medians are +4.788 to +5.226 ms and +3.213 to +3.707 ms. Browser readiness rises by 12.800 ms and 12.250 ms, with intervals +12.300 to +13.800 ms and +11.900 to +12.800 ms. First-SVG streaming also regresses. Large repeated scenes have larger regressions. Small cases sometimes have intervals spanning zero; the evidence does not claim a difference there.

Precomputed combined data reduces first-launch work on KeySquare, with a median improvement of 0.300 ms in each campaign. That local gain does not offset the measured transfer and preparation regressions. The results apply to these two implementations on the recorded M1 Pro/Chrome 154 setup. The wrappers retain some avoidable encode/decode work during server preparation; changing it would need new paired server evidence. The whole-page byte regressions already block these exact transport representations.

## Release assets and remaining gates

The proofs use Vite aliases and generated files under `.artifacts/css-client/`. They are outside package exports. They emit only Astro's normal processed scripts and embedded recovery data; no extra runtime asset manifest or consumer configuration is required in these experimental builds.

No production delivery format, package preparation step or installed-consumer behavior is approved here. Publishing generated experiment files would be incorrect. Any later accepted design must specify stable internal records and release assets, qualify clean installed Astro consumers and repeat production measurements in #111 and the packaging stages.

The production browser-free suite passes 115 tests, 470 drawings and 944 bundle cases. Both proof pages exclude the identified compiler/sampler modules. Existing numerical comparisons and source-removed/template/navigation controls pass with unchanged tolerances. Synthetic lifecycle evidence, native browser-media qualification and owner visual acceptance remain distinct. No owner acceptance is inferred from numerical results.

## Bounded next option

Keep #109's selective entries separate. The next proof can test one generated recovery asset per rendered recipe, eagerly loaded before its tag is defined, instead of repeating CSS and scalar samples on every host. Limit that proof to Bell/UserRoundCog, KeySquare, CircleDashed and EyeOff plus a retained Motion mixture. Use one, twenty repeated instances and a real navigation before extending membership.

That option must count initial and eventual JS, CSS and JSON requests, package asset resolution, first definition, source-removed clones, missing sheets and complete pages. Any new asynchronous dependency needs its own contract decision. It remains an untested option under the current recovery contract.

#111 remains blocked until the owner approves a concrete recovery design. The frozen budgets remain in place.
