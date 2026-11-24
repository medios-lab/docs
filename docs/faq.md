---
title: FAQ
slug: /faq
doc_type: concept
---

# Frequently Asked Questions

## Why does Medios have no built-in scheduler or web UI?

Medios separates resource brokering from scheduling policy. The controller and nodes handle offer accounting, launching, and isolation; frameworks own queuing, placement, retries, and dashboards via `/api/v1/scheduler` and `/api/v1` (the Operator API).

## Why does a cluster run only one containerizer?

A Medios cluster is a homogeneous runtime zone (`medios` or `docker_shell`). Eliminating per-node containerizer composition keeps launch validation explicit and predictable. Run separate clusters or node pools if you need heterogeneous container runtimes.

## Why did my CPU-only framework receive zero offers on a GPU cluster?

By default (`--filter_gpu_resources=false`), `medios-controller` offers GPU-bearing nodes to every framework, and frameworks that do not request `gpus` simply leave them unused. However, if the cluster operator enabled `--filter_gpu_resources=true`, the allocator excludes every resource on a GPU-bearing node — including its CPUs and memory — from frameworks that do not declare `GPU_RESOURCES` in `FrameworkInfo.capabilities`. Add `GPU_RESOURCES` to `FrameworkInfo.capabilities` so your framework receives offers regardless of that controller flag.

## Why is Go the only official SDK?

Medios keeps its supported surface deliberately small: **`medios-sdk-go`** is the reference SDK, and the embedded **OpenAPI 3.x specs** (`/api/openapi`) plus [RecordIO Framing](/api/recordio) provide the language-agnostic contract for clients in Python, Rust, TypeScript, or AI agents.

## How does Medios relate to Apache Mesos?

Medios was forked from Apache Mesos to preserve the two-level resource-offer model and Linux isolation spine while removing ZooKeeper, the replicated log, CSI storage, the web UI, and multi-tenant oversubscription machinery. Medios does not track upstream commits after the fork.
