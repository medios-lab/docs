# Medios Documentation (`medios-lab/docs`)

Public documentation site for [Medios](https://github.com/medios-lab/medios) and its reference Go SDK ([`medios-lab/medios-sdk-go`](https://github.com/medios-lab/medios-sdk-go)), built with Docusaurus 3 and offline local search.

## Local development

```sh
npm install
npm start
```

## Lint and build

```sh
npm run lint:docs
npm run build
```

`npm run lint:docs` enforces:

- Every doc page carries valid `title` and `doc_type` (`concept`, `tutorial`, `how-to`, `reference`, `release-notes`) frontmatter.
- Every `sidebars.js` ID resolves to a Markdown file in `docs/` with no orphaned files.
- No internal decision-record numbers, issue numbers, private hostnames/IPs, internal project names, or deprecated upstream vocabulary appear in published product pages.

## Syncing from upstream product repositories

OpenAPI specs and generated CLI flag tables can be refreshed from local checkouts of `medios-lab/medios` and `medios-lab/medios-sdk-go`:

```sh
node scripts/sync-sources.mjs --medios-dir ../medios --go-sdk-dir ../medios-sdk-go
node scripts/gen-cli-reference.mjs --medios-dir ../medios
```

## Scope

This repository publishes **public product documentation only**:

- Platform concepts, installation, cluster operations, security, workloads, CLI reference, and HTTP API + OpenAPI specs (`medios-lab/medios`).
- Reference Go SDK documentation (`medios-lab/medios-sdk-go`).
- Design principles (`FAC3-*`), research papers, internal handoffs, and experimental SDKs are intentionally excluded from this site.
