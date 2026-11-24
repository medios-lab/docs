---
title: Resource Offers & Accounting
doc_type: concept
---

# Resource Offers & Accounting

An offer is the controller's statement that a set of unallocated resources on one node is available to one framework right now. Frameworks receive offers on their `SUBSCRIBE` stream and reply with `ACCEPT` or `DECLINE`.

## An offer names one node and one role

Each offer carries a `node_id`, a `framework_id`, a role, node attributes, and a list of typed `Resource` entries:

- **`SCALAR`:** floating-point quantities such as `cpus`, `mem` (in MiB), `disk` (in MiB), `gpus`, or operator-declared custom names.
- **`RANGES`:** integer intervals such as `ports` (`31000-32000`).
- **Opaque metadata:** arbitrary key/value labels attached to resources (for example `class=h100`). The controller compares metadata by equality and never interprets the values.

## Offered, accepted, and consumed are ledger entries

Medios accounts strictly for **declared** capacity and **allocated** ledger entries, not live OS utilization metrics. A resource carved from an offer remains charged to the task until the task reaches a terminal state.

## Resource identity must be preserved on accept

An offered `Resource` carries role, reservation, allocation info, resource provider, and metadata fields. When accepting an offer, carve the desired quantity out of the offered `Resource` object with all other fields intact rather than constructing a bare `Resource` from scratch.

```json
{
  "type": "OFFERS",
  "offers": {
    "offers": [{
      "id": {"value": "<offer-id>"},
      "node_id": {"value": "<node-id>"},
      "resources": [
        {"name": "cpus", "type": "SCALAR", "scalar": {"value": 4}},
        {"name": "mem", "type": "SCALAR", "scalar": {"value": 4096}},
        {"name": "ports", "type": "RANGES", "ranges": {"range": [{"begin": 31000, "end": 32000}]}}
      ]
    }]
  }
}
```

## Offers are held until you reply or they are rescinded

Without `--offer_timeout`, the controller holds an offer until the framework sends `ACCEPT` or `DECLINE`, disconnects, or the node is lost. Idle frameworks must decline unwanted offers with a refuse filter and call `SUPPRESS` so other frameworks can schedule on the cluster.

## What's next

- [Scheduler Contract & Best Practices](/frameworks/contract)
- [Multi-Node Gang Admission](/workloads/gang-admission)
