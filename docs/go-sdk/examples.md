---
title: Example Frameworks
doc_type: how-to
---

# Run the Go SDK Example Frameworks

The [`medios-sdk-go/examples`](https://github.com/medios-lab/medios-sdk-go/tree/main/examples) directory contains complete, runnable `main` programs that connect to a live controller.

## Example catalog

| Example | What it demonstrates |
| --- | --- |
| `examples/reference` | **Start here.** Canonical well-behaved framework: `WithUser`, carving, refuse-filter `Decline`, decline-on-error, `Suppress`/`Revive`, `Acknowledge`, `TaskState` classification, and `Teardown`. |
| `examples/summer` | Partitions `1..N` across `M` tasks and reads each partial sum back from the node sandbox to compute the verified total. |
| `examples/multi-role` | Multi-role offer handling and role-scoped resource carving. |
| `examples/ports` | Carving `RANGES` port resources from an offer for listening tasks. |
| `examples/kernel-host` | Host-level task execution pattern. |
| `examples/observer-haiku` | Demonstration task observer binary that tails `./stdout` and emits periodic judgments using an external credential file. |

## Run `examples/reference`

```sh
git clone https://github.com/medios-lab/medios-sdk-go.git
cd medios-sdk-go
go run ./examples/reference -controller http://<controller>:5050 -user <node-user> -n 3
```

## Run `examples/summer`

```sh
go run ./examples/summer -controller http://<controller>:5050 -user <node-user> -n 100 -m 2
```

```text
partition finished index=0 range=1..50   partial=1275
partition finished index=1 range=51..100 partial=3775
sum(1..100) = 5050  [verified from 2 task results]
```

## What's next

- [Writing a Framework in Go](/go-sdk/writing-a-framework)
- [Packages & Helpers](/go-sdk/packages)
