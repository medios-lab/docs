---
title: OpenAPI Discovery & Specs
doc_type: reference
---

# OpenAPI Discovery & Specs

Both Medios daemons embed an OpenAPI 3 specification directly into the binary and serve it with `Content-Type: application/openapi+json` at standard discovery paths. In `medios v0.1.14`, the daemon binaries embed route-level discovery specs; the full ProtoJSON OpenAPI 3.1.0 specifications below are published here and scheduled for embedding in a subsequent `medios` release.

In the published OpenAPI 3.1.0 specs, every v1 typed RPC union (`SchedulerCall`, `SchedulerEvent`, `ControllerCall`, `ControllerResponse`, `ControllerEvent`, `NodeCall`, `NodeResponse`, `ExecutorCall`, `ExecutorEvent`, `ResourceProviderCall`, `ResourceProviderEvent`) is modeled with discriminated `oneOf` ProtoJSON schemas derived directly from `include/medios/v1/**/*.proto` with `additionalProperties: false` on protocol messages.

## Runtime discovery endpoints

Fetch the live specification directly from any running daemon:

```sh
curl -s http://<controller>:5050/openapi.json
curl -s http://<controller>:5050/.well-known/openapi.json

curl -s http://<node>:5051/openapi.json
curl -s http://<node>:5051/.well-known/openapi.json
```

## Published specifications

Download the static OpenAPI 3.1.0 specifications bundled with this documentation build:

- [Controller OpenAPI 3.1.0 JSON](pathname:///openapi/controller.openapi.json) (228 component schemas)
- [Node OpenAPI 3.1.0 JSON](pathname:///openapi/node.openapi.json) (181 component schemas)

## Building clients in any language

The v1 APIs use a typed `POST` envelope whose `type` field selects the logical call (for example `SUBSCRIBE`, `ACCEPT`, `DECLINE`, or `GET_STATE`). Use the OpenAPI specs to inspect routes, status codes, and headers, and pair them with [RecordIO Framing](/api/recordio) for the `SUBSCRIBE` event stream.

If you are writing a framework in Go, use the reference [Go SDK](/go-sdk).

## What's next

- [Scheduler HTTP API](/api/scheduler)
- [Operator HTTP API](/api/operator)
- [RecordIO Framing](/api/recordio)
