---
title: C++ Scheduler Driver
doc_type: how-to
---

# Use the C++ Scheduler Driver

Medios ships `MediosSchedulerDriver`, a C++ scheduler driver that wraps the same wire protocol as `/api/v1/scheduler`.

## Before you begin

- Medios built from source with headers under `include/medios/` (see [Build from Source](/installation/build-from-source)).

## Implement `Scheduler` and start the driver

Subclass the `Scheduler` interface (`registered`, `resourceOffers`, `statusUpdate`, `offerRescinded`) and pass it with your `FrameworkInfo` and controller address to `MediosSchedulerDriver`:

- Call `driver.start()` or `driver.run()` to open the subscription loop.
- Call `driver.launchTasks()` or `driver.acceptOffers()` to launch tasks, and `driver.declineOffer()` to return unused offers.
- Call `driver.stop()` when shutting down cleanly.

For new external frameworks, prefer the [Go SDK](/go-sdk) or the [HTTP API & OpenAPI](/api/openapi) so your framework stays decoupled from C++ build toolchains and libprocess.

## What's next

- [Go SDK](/go-sdk)
- [HTTP API & OpenAPI](/api)
