---
title: Packages & Helpers
doc_type: reference
---

# Go SDK Packages & Helpers

Packages provided by `github.com/medios-lab/medios-sdk-go`.

| Package | Responsibility | Key symbols |
| --- | --- | --- |
| `medios` | Wire types for all Calls and Events, RecordIO codec, resource carving, offer matching, task state helpers, stores, observers, progress, and finish hooks | `NewTaskInfo`, `Offer.CarveScalar`, `Offer.CarveScalars`, `Offer.MatchesAttributes`, `Offer.SupportsContainer`, `ClusterView`, `TaskInfo.WithStore`, `TaskInfo.WithObserver`, `ProgressPolicyForProfile`, `TaskState.IsActive`/`IsTerminal`/`IsFailure`, `TaskStatus.WorkExitCode`, `TaskStatus.StoreUnitRefused` |
| `scheduler` | HTTP v1 scheduler driver threading `Medios-Stream-Id` and capturing `framework_id` | `NewClient`, `Subscribe`, `Accept`, `Decline`, `Suppress`, `Revive`, `Kill`, `Acknowledge`, `Reconcile`, `Teardown` |
| `sandbox` | Resolves node address from `/nodes` and `work_dir` from node `/state`, then reads or tails task sandbox files | `Resolver.Locate`, `Node.PathFor`, `Resolver.Read`, `Resolver.CaptureTail`, `TrimUTF8Tail` |
| `store` | Narrow singleton + blob-bucket persistence interface for `framework_id` and domain records | `store.Store`, `store/sqlite` (WAL, embedded migrations, pure Go), `store/memory`, `store/storetest` |
| `outputs` | Manifest publishing, verification, and reading of declared task outputs | `Publish`, `Verify`, `Read`, plus `cmd/medios-outputs` CLI |
| `timestamp` | Millisecond-precision UTC timestamps with ISO-8601 JSON encoding | `Timestamp` |

## Unknown-field preservation

`medios` preserves JSON fields that the Go struct does not explicitly model during decode and re-encode, ensuring offer resources round-trip intact across controller upgrades.

## What's next

- [Example Frameworks](/go-sdk/examples)
- [Writing a Framework in Go](/go-sdk/writing-a-framework)
