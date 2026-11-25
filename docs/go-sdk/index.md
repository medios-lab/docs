---
title: Go SDK
slug: /go-sdk
doc_type: concept
---

# Go SDK (`medios-sdk-go`)

[`medios-lab/medios-sdk-go`](https://github.com/medios-lab/medios-sdk-go) is the official reference SDK for building Medios frameworks. It handles the wire protocol, RecordIO stream framing, resource carving, task-lifecycle helpers, sandbox output retrieval, and a narrow state store while leaving all scheduling policy to your framework.

Building in another language? Use [OpenAPI Discovery & Specs](/api/openapi) with [Building Frameworks](/frameworks).

## Install

Requires Go 1.25+. No CGO is required (`modernc.org/sqlite` is pure Go). Pin a tagged release:

```sh
go get github.com/medios-lab/medios-sdk-go@v0.17.0
```

## Ownership boundary

```text
        Framework A                         Framework B
   ┌───────────────────┐              ┌───────────────────┐
   │ domain objects    │              │ domain objects    │
   │ scheduling policy │              │ scheduling policy │
   │ external API      │              │ external API      │
   └─────────┬─────────┘              └─────────┬─────────┘
             └──────────────┬───────────────────┘
              ┌─────────────┴──────────────┐
              │ scheduler · store · sandbox │
              │ medios · outputs · timestamp│
              └─────────────────────────────┘
                      medios-sdk-go
```

- **The SDK owns** shared wire mechanics: HTTP v1 driver, `Medios-Stream-Id` threading, RecordIO parsing, resource carving with unknown-field preservation, store/observer/progress/finish helpers, sandbox reading/tailing, and a narrow KV persistence interface.
- **Your framework owns** domain models (jobs, services, pipelines), scheduling policy, external REST/RPC APIs, and task-record schemas.

## Guides in this section

- [Writing a Framework in Go](/go-sdk/writing-a-framework) — complete walkthrough from client setup to sandbox reading and teardown.
- [Packages & Helpers](/go-sdk/packages) — package-by-package API summary.
- [Example Frameworks](/go-sdk/examples) — runnable reference frameworks included in the SDK repo.
