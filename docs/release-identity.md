# Motion Astro release identity

Motion Astro is the owner's chosen product identity. The owner confirmed `@motion-astro/icons` as the npm name, `icons.astromotion.dev` as the documentation hostname and MIT as the license for the project's own contributions on 2026-11-02. The copyright holder, namespace access, version policy and release owners remain unresolved. This record covers [issue #107](https://github.com/pommito/astro-animated-icons/issues/107) under [the release plan #106](https://github.com/pommito/astro-animated-icons/issues/106). It does not complete #107.

The audit below describes commit `90302b37876ba25f417b63ffd721fbab5e21f0aa` on 2026-11-02. Runtime measurement work, including #108, can continue with the existing package name and API. [Packaging #115](https://github.com/pommito/astro-animated-icons/issues/115) applies the approved metadata and license files later. Publication and deployment require their separate release approval.

## Decision register

| Decision | Recorded state | Needed before approval |
| --- | --- | --- |
| Product identity | Motion Astro, confirmed by the owner in the task instructions | Use product branding rather than a personal package brand. Preserve upstream author credits. |
| Exact npm name | `@motion-astro/icons`, confirmed by the owner on 2026-11-02 | Establish namespace access and recheck the name before release. The confirmation does not reserve it. |
| npm namespace and access | Pending | Identify the publishing npm account and package administrators. Prove access to the selected `motion-astro` user or organization scope and its publishing permissions. |
| Project license | MIT, SPDX identifier `MIT`, confirmed by the owner on 2026-11-02 for the project's own contributions | Confirm the copyright holder and wording. Apply the license files and metadata in #115. Product branding alone does not establish copyright ownership. |
| Attribution | Existing upstream credits must remain, as required by the task instructions | Resolve the provenance and notice gaps below. Keep upstream notices with copied or adapted material under their existing terms. |
| First version and version policy | Pending | Choose the first public version, whether to use prereleases, and the compatibility policy before 1.0 if applicable. |
| Public naming | Existing contract remains in force | Decide whether the first release changes only the package import or also tags and handle names. Approve exact replacements and migration scope before applying any change. |
| Documentation hostname | Owner confirmed the domain `astromotion.dev` and hostname `icons.astromotion.dev` on 2026-11-02 | Use this hostname for documentation. Domain control, DNS and hosting configuration have not been verified. |
| Hosting and deployment | Pending | Name the hosting project/provider, account with deployment access, DNS owner and deployment owner. |
| Release responsibility | Pending | Identify maintainers, the person accountable for npm publication and who can approve releases. A public brand does not replace registry access controls. |

## Existing licenses and attribution

The only tracked license/notice file is [THIRD_PARTY_NOTICES.md](../packages/animated-icons/THIRD_PARTY_NOTICES.md). There is no root project license file yet. [The README](../README.md#attribution-and-license) records the selected MIT license and the remaining copyright-holder and license-file preparation before publication.

| Material | Existing credit and terms | Source checked |
| --- | --- | --- |
| Lucide drawings | ISC, Lucide Icons and Contributors, 2026 | [Current Lucide license](https://lucide.dev/license) and [the license at the pinned Monitor drawing revision](https://github.com/lucide-icons/lucide/blob/66de90d63e5e26d867a4391bd607fd7a3bbe17fd/LICENSE) |
| Feather-derived drawings | MIT, Cole Bemis, 2013-present, with Lucide's list of Feather-derived icons | Lucide's license above and [Feather's own MIT license](https://github.com/feathericons/feather/blob/master/LICENSE), which currently uses 2013-2023 |
| Adapted Lucide Animated recipes | MIT, pqoqubbw, 2024-2026 | [License at recipe revision 4662fff](https://github.com/pqoqubbw/icons/blob/4662fff2b60fdcf4751b32013606756caf7c4c26/LICENSE) |
| Motion dependency and adapted easing | MIT, Motion B.V., 2024 | Installed `motion` 13.5.1 and `motion-utils` 13.5.0 license files, resolved by [the lockfile](../pnpm-lock.yaml), and [Motion's license](https://github.com/motiondivision/motion/blob/main/LICENSE.md) |
| BezierEasing adaptation through motion-utils | MIT, Gaëtan Renaudeau, 2014 | Installed `motion-utils` cubic-Bezier source credits BezierEasing. Its [license](https://github.com/gre/bezier-easing/blob/master/LICENSE) matches the existing credit. |

The ISC and MIT texts require preservation of their copyright and permission notices in the copies covered by their terms. Selecting a license for Motion Astro's own contributions does not remove those requirements. The notices also cover adapted easing used by the [combined transform sampler](../packages/animated-icons/src/shared/combined-transform-cycle.ts), even on a CSS page without a Motion runtime import.

### Provenance gaps to resolve before release

A local comparison of [the public catalogue](../packages/animated-icons/src/astro.ts) with notice links found 470 exports and 469 distinct icon source links. These counts establish link coverage, not a source-by-source verification of every adaptation.

- `Folder` has no icon source link in the notices. Recover its actual drawing and recipe provenance from its introduction and [PR #92](https://github.com/pommito/astro-animated-icons/pull/92). Record the applicable revision and any local behavior changes. Do not assign a revision from another icon.
- `MapPin`, `ArrowLeft`, `Copy` and `Check` link to the upstream `main` branch. Recover the revisions actually used before replacing these links with immutable references.
- The pinned Monitor revision's license attributes Lucide contributions to Lucide Contributors in 2022 and Feather portions to Cole Bemis for 2013-2022. The current notice uses the later Lucide header. Preserve the original pinned attribution alongside the existing credits when preparing the release notices. Do not replace original copyright holders with Motion Astro.
- The Lucide and Lucide Animated license links currently target `main`. Keep the embedded texts and record the revisions used for the release. Feather's standalone year range differs from the notice inherited through Lucide; keep that provenance explicit rather than normalizing copyright years.
- Four relative links in the notices point outside the package to `../../docs/`. They resolve in the repository but their targets are absent from the npm file list. Packaging must use repository URLs pinned to the release revision or include suitable targets without pulling unrelated documentation into the archive.

No upstream credit or license text changes in this audit. The package's React comparison sources are fixture-only and excluded by the current package file list. Packaging must check dependencies and copied material again against the exact release artifact after the runtime changes.

## npm candidates and ownership

Unauthenticated GET requests to the public npm registry on 2026-11-02 returned the following results. The checks made no registry writes.

| Candidate | Checked at, UTC | Registry result | Ownership needed |
| --- | --- | --- | --- |
| `motion-astro-icons` | 14:08:23.287 | [Package endpoint](https://registry.npmjs.org/motion-astro-icons) returned HTTP 404, `{"error":"Not found"}` | A publishing account and approved package maintainers. No product scope is required. |
| `@motion-astro/icons` | 14:08:23.555 | [Package endpoint](https://registry.npmjs.org/%40motion-astro%2Ficons) returned HTTP 404, `{"error":"Not found"}` | Control of the `motion-astro` npm scope and permission to publish within it. |

Neither response proves that a name is claimable or that the owner has namespace access. Naming restrictions can still apply. The scoped candidate may also be occupied by a private package that a public read cannot reveal. Recheck the selected name before release. No name, account or organization was reserved.

The owner selected `@motion-astro/icons` on 2026-11-02. Namespace access remains unverified. `motion-astro-icons` was an audited alternative and is not the selected release name.

[npm scopes](https://docs.npmjs.com/about-scopes/) belong to matching npm users or organizations. Domain ownership does not grant that scope. [Public scoped publication](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/) also requires explicit public access configuration. The selected name does not authorize account creation or publication.

## Metadata and distribution audit

| File or field | Current value | Release work after decisions |
| --- | --- | --- |
| [Workspace manifest](../package.json) | `astro-animated-icons-workspace`, private, Node `>=22.12.0`, pnpm `12.5.1` | Keep the workspace private. Distinguish development tool requirements from consumer compatibility. |
| [Package manifest](../packages/animated-icons/package.json) | `@grave/animated-icons`, `0.0.0`, private, `UNLICENSED` | Apply the approved name, first version and project license in #115. Keep the publication guard until the release process permits its removal. |
| Package public entry | `./astro` exports `./src/astro.ts` | Qualify the installed artifact in clean Astro consumers in #115. |
| Published files | `src`, `THIRD_PARTY_NOTICES.md`, plus npm's package manifest | Include the approved project license and a package README. Verify the actual archive. |
| Peer and dependency | Astro `^7.2.10`, Motion `^13.4.4` | #115 qualifies or narrows supported versions with evidence and approval. This audit does not change dependencies. |
| Package description and keywords | Absent | Describe Motion Astro's Astro components and selective loading. Avoid unmeasured performance claims. |
| Repository and issue tracker fields | Absent | Current origin is `https://github.com/pommito/astro-animated-icons.git`. If retained, use its package directory and issue tracker in metadata. Repository relocation is not decided here. |
| Homepage | Absent | Use the deployed documentation URL at the confirmed `icons.astromotion.dev` hostname when preparing metadata in #115. |
| Author/contributor metadata | Absent | Confirm project attribution wording. Keep original authors in third-party notices, separately from the product identity and npm maintainers. |
| `publishConfig` and release CI | Absent | #115 prepares registry/access configuration and the reviewed publication workflow. #117 owns approved publication. |

[npm's manifest documentation](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) defines `UNLICENSED` for a package that grants no project license and `private: true` as a publication guard. Neither selects an open-source license for the project. These fields do not remove the existing upstream grants.

### Dry-run package contents

The baseline dry run used Node `v22.20.0`, npm `10.9.3` and pnpm `12.5.1`:

```sh
rtk proxy npm pack ./packages/animated-icons --dry-run --json --ignore-scripts --cache /private/tmp/motion-astro-107-npm-cache
```

The result lists 1740 entries, a compressed archive size of 207508 bytes and an unpacked size of 1427614 bytes. These are npm dry-run sizes, not browser payload measurements. The file list contains 1738 source files, `package.json` and the 177747-byte `THIRD_PARTY_NOTICES.md`. It contains no bundled dependencies, fixture files, benchmark artifacts or repository documentation. It contains no README or project license file.

The full local dry-run JSON is retained in `.artifacts/identity-pack-dry-run.json`. The dry run created no tarball, installed no external consumer and published nothing. It establishes the current file selection only. #115 must pack the final artifact, retain its checksum and test clean consumers. The public release must then verify installation from the npm registry.

## Public API naming and migration

The [current Usage contract](../README.md#usage) remains the working contract:

- Imports use `@grave/animated-icons/astro`.
- Components and handles keep names such as `ArrowLeft` and `ArrowLeftIconHandle`.
- Custom-element tags keep names such as `grave-arrow-left`. `customElements.whenDefined()` therefore continues to use that name.
- Props, `void` playback methods, initial server-rendered SVG, reduced motion and lifecycle behavior keep their current contracts.

A package rename changes import specifiers and workspace consumers. It does not imply a tag or handle rename. If the owner requests any additional public-name change, record every old/new pattern and affected import, registration, attribute, stylesheet identifier, handle, fixture and validator before implementation. Distinguish public contract changes from private identifiers that need no rename. #115 applies only the approved scope in a controlled commit with its own baseline and the existing validations.

## Evidence and remaining gates

The audit used `rtk git status --short --branch`, `rtk git worktree list --porcelain`, `rtk git remote -v` and `rtk git rev-parse HEAD` before editing. It started from the SHA above in an isolated worktree. It read issues #106, #107 and #115 through `rtk proxy gh issue view` on origin.

License inventory used `rtk rg --files --hidden -g '!.git' -g '*LICENSE*' -g '*NOTICE*' -g '*COPYING*' -g '*ATTRIBUT*'`. Source-link coverage compared exported icon slugs with the icon paths in the notices. The pinned Lucide license was read with:

```sh
rtk proxy gh api 'repos/lucide-icons/lucide/contents/LICENSE?ref=66de90d63e5e26d867a4391bd607fd7a3bbe17fd' --header 'Accept: application/vnd.github.raw+json'
```

To repeat the read-only npm check without registry credentials:

```sh
rtk proxy node --input-type=module -e 'for (const name of ["motion-astro-icons", "@motion-astro/icons"]) { const url = "https://registry.npmjs.org/" + encodeURIComponent(name); const response = await fetch(url); console.log(JSON.stringify({checkedAt: new Date().toISOString(), name, url, status: response.status, result: await response.json()})); }'
```

Local verification resolved all 15 Markdown paths and anchors in the README and this record. It also checked the documented catalogue counts, four mutable source links, missing Folder link and dry-run file selection against their source files.

`rtk pnpm install --frozen-lockfile --offline` first failed because `mdn-data@2.27.1` was absent from the local cache. `rtk pnpm install --frozen-lockfile` then succeeded without changing the manifests or lockfile. `rtk pnpm validate` passed in 168.610 seconds, including both Astro checks with zero errors, warnings or hints, 470 initial drawings, 944 bundle cases, 120 migrated recipes across 132 compositions and all 108 Node tests. The production fixture build still emitted warnings for fixture-only React `use client` directives and a large generated chunk. Routine validation launched no browser.

The completed preparation is the license/metadata inventory, dated registry observations and package-file audit. The npm name, documentation hostname and MIT license now have owner confirmation. The copyright holder, first-version policy, maintainers, public-name migration scope and release/deployment responsibility remain open. Provenance corrections, final license files, the final artifact, namespace permission checks, registry installation and deployment remain pending. No DNS or hosting configuration was changed. This audit adds no browser qualification or visual acceptance.
