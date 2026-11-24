---
title: Overview
slug: /
doc_type: concept
---

# Medios

Medios is a resource broker for agentic and AI workloads. Nodes advertise their available compute resources, the controller turns those advertisements into resource offers, and external frameworks accept or decline offers to launch isolated tasks.

Medios separates resource brokering from scheduling policy. The platform manages the offer loop, task launching, lifecycle tracking, and Linux isolation. Your framework — whether a 100-line AI agent loop or a higher-level distributed runtime such as Ray running via [Ray on Medios (`ray-medios`)](/frameworks/ray-on-medios) — owns queuing, placement, retries, and job semantics.

## Two daemons and two HTTP APIs

A Medios cluster runs two daemons:

- **`medios-controller`** tracks node registrations, generates resource offers, validates accepted tasks, and records task lifecycle state.
- **`medios-node`** advertises declared machine resources, launches tasks inside isolated containers or processes, and streams status updates back to the controller.

External consumers talk to the cluster over two HTTP/JSON APIs:

- **`/api/v1/scheduler`** streams resource offers and status updates to frameworks and accepts launch, decline, kill, and reconciliation calls.
- **`/api/v1`** (Operator API) exposes cluster inspection and maintenance operations on both `medios-controller` and `medios-node`.

Both daemons serve embedded OpenAPI 3 specifications at `/openapi.json` and `/.well-known/openapi.json`.

## What Medios provides

- **Extensible resource-offer brokering** across built-in compute, exclusive equipment, reusable hardware (`medios-gpu`), and consumable external budgets (`medios-tokens`) — see [Extending Resources](/architecture/extending-resources).
- **Two containerizers, one per cluster:** `medios` pulls OCI images directly without a Docker daemon; `docker_shell` delegates to the host `docker` CLI.
- **Linux isolation** via cgroups v1 and v2, namespaces, POSIX rlimits, capabilities, seccomp, and operator-declared GPU devices.
- **Shared dataset stores** declared per node as `store/<name>` resources with reader and writer unit accounting.
- **Agentic task primitives:** structured progress reporting with stall detection, sidecar task observers, and post-exit finish hooks.
- **Optional automatic failover** via etcd v3 leader election and `leveldb` controller persistence.

## What Medios intentionally leaves out

- **No built-in scheduler policy.** Medios emits offers; your framework decides what runs where.
- **No web dashboard.** Downstream tooling builds on `/api/v1` (the Operator API) and `/metrics/snapshot`.
- **No storage control plane.** Medios supports operator-declared shared dataset stores (`STORE` volumes), not arbitrary host-path mounts, CSI, or distributed block storage.
- **No multi-tenant fairness platform.** Medios assumes a single trusted tenant per cluster, with optional mTLS, HTTP authentication, and `LocalAuthorizer` ACLs for multi-host deployments.

## Choose your path

| If you want to... | Start here |
| --- | --- |
| Run a local cluster and submit a task | [Quick-Start Guide](/quick-start) |
| Deploy and secure a cluster | [Installation](/installation) and [Security](/security) |
| Build a framework in Go | [Go SDK](/go-sdk) |
| Build a framework in another language or agent | [Building Frameworks](/frameworks) and [OpenAPI Discovery & Specs](/api/openapi) |
| Look up daemon flags or wire endpoints | [CLI Tools](/cli) and [HTTP API & OpenAPI](/api) |
| Read these docs programmatically as an AI agent | [`/llms.txt`](pathname:///llms.txt), [`/llms-framework.txt`](pathname:///llms-framework.txt), and [`/llms-operator.txt`](pathname:///llms-operator.txt) |
