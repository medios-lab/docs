---
title: HTTP API & OpenAPI
slug: /api
doc_type: concept
---

# HTTP API & OpenAPI

Medios exposes typed RPC-style HTTP/1.1 JSON endpoints on both daemons, backed by embedded OpenAPI 3 specifications.

## Why there are two OpenAPI specifications

`medios-controller` and `medios-node` intentionally expose overlapping paths (`/api/v1`, `/state`, `/flags`, `/health`, `/version`). Publishing one specification per daemon avoids path collisions and mirrors runtime behavior exactly:

- **Controller spec:** `/api/v1/scheduler`, `/api/v1` (controller operator calls), `/state`, `/nodes`, `/tasks`, `/frameworks`, `/metrics/snapshot`, and utility routes.
- **Node spec:** `/api/v1/executor`, `/api/v1` (node operator calls), `/files/*`, `/stores/*`, `/state`, and utility routes.

## API guides

- [OpenAPI Discovery & Specs](/api/openapi) — download and inspect `controller.openapi.json` and `node.openapi.json`.
- [Scheduler HTTP API](/api/scheduler) — `/api/v1/scheduler` Calls and Events.
- [Operator HTTP API](/api/operator) — `/api/v1` cluster inspection and node maintenance calls.
- [Executor HTTP API](/api/executor) — `/api/v1/executor` custom executor contract.
- [RecordIO Framing](/api/recordio) — wire framing for streaming HTTP responses.
