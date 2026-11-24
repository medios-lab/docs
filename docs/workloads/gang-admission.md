---
title: Multi-Node Gang Admission
doc_type: concept
---

# Multi-Node Gang Admission

Gang admission lets a framework request an all-or-none set of per-node resource shapes — such as four nodes each with eight H100 GPUs for distributed training — and receive the entire grant atomically in one `OFFERS` event.

## A `REQUEST` call specifies per-node resource shapes

Instead of hoarding partial offers one node at a time while waiting for peers, a framework sends a `REQUEST` call on `/api/v1/scheduler` listing the resource shape required on each distinct node. Resources can include opaque key/value metadata (such as `class=h100`) matched by exact equality.

## The grant arrives as one atomic `OFFERS` event

When the allocator finds distinct nodes satisfying every requested shape simultaneously, it emits all matching offers together in a single `OFFERS` event. Each offer carries the node's hostname and reserved ports needed to wire distributed rendezvous (such as `MASTER_ADDR` and `MASTER_PORT`) across ranks before sending `ACCEPT`.

## Gang grants do not survive controller restart

Like ordinary offers, an unaccepted gang grant is rescinded on controller restart. Frameworks re-issue `REQUEST` on reconnect and resume from checkpoints.

## What's next

- [Resource Offers & Accounting](/architecture/offers)
- [Scheduler HTTP API](/api/scheduler)
- [Networking Model](/architecture/networking)
