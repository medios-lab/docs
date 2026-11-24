---
title: Writing a Framework in Go
doc_type: tutorial
---

# Write a Framework with `medios-sdk-go`

In about ten minutes you wire up a Go framework that subscribes to a controller, carves resources safely, launches tasks with a required submitter principal, acknowledges updates, reads sandbox `stdout`, and tears down cleanly.

## What you need

- Go 1.25+ and `github.com/medios-lab/medios-sdk-go`.
- A running controller at `http://<controller>:5050` with at least one node.
- An OS user (`<node-user>`) that exists on every target node.

## 1. Construct the scheduler client

```go
client, err := scheduler.NewClient(
    "http://<controller>:5050",
    "my-framework",
    scheduler.WithUser("<node-user>"),
    scheduler.WithPrincipal("team:platform"),
    scheduler.WithCapabilities(medios.CapabilityGPUResources),
)
if err != nil {
    return err
}
```

Pass `medios.CapabilityGPUResources` (and `medios.CapabilitySharedResources` if your framework mounts shared dataset stores) so your framework receives GPU-node and store offers even when the controller runs with `--filter_gpu_resources=true` or `--filter_shared_resources=true` (both default to `false`).

## 2. Subscribe and handle offers

```go
events, errs, err := client.Subscribe(ctx)
if err != nil {
    return err
}

for {
    select {
    case <-ctx.Done():
        return ctx.Err()
    case err, ok := <-errs:
        if !ok {
            errs = nil
            continue
        }
        return err
    case ev := <-events:
        switch ev.Type {
        case medios.EventOffers:
            for _, offer := range ev.Offers.Offers {
                carved, _, ok := offer.CarveScalars(map[string]float64{
                    "cpus": 0.5,
                    "mem":  128,
                })
                if !ok || !wantToLaunch {
                    _ = client.Decline(ctx, []medios.ID{offer.ID}, 120)
                    continue
                }
                task, err := medios.NewTaskInfo(
                    "operator:alice",
                    "hello",
                    medios.ID{Value: "hello-1"},
                    offer.NodeID,
                    carved,
                    medios.CommandInfo{Shell: true, Value: "echo hello-medios"},
                )
                if err != nil {
                    _ = client.Decline(ctx, []medios.ID{offer.ID}, 120)
                    continue
                }
                if err := client.Accept(ctx, []medios.ID{offer.ID}, []medios.TaskInfo{task}); err != nil {
                    _ = client.Decline(ctx, []medios.ID{offer.ID}, 120)
                }
            }
        case medios.EventUpdate:
            st := ev.Update.Status
            if st.UUID != "" {
                _ = client.Acknowledge(ctx, st.TaskID.Value, st.NodeID.Value, st.UUID)
            }
            if st.State.IsTerminal() {
                _ = client.Teardown(ctx)
                return nil
            }
        }
    }
}
```

Use `offer.CarveScalar` / `offer.CarveScalars` instead of constructing new `medios.Resource` structs so role, reservation, provider, and metadata fields round-trip verbatim.

## 3. Attach stores, observers, and progress policies (optional)

```go
task, err = task.WithStore(offer, "training-v1", "/data", medios.StoreRO)
err = task.WithObserver("nan", medios.CommandInfo{
    Shell: true,
    Value: "tail -F stdout | grep -m1 -i nan | sed 's/^/ISSUE /'",
})
task.ProgressPolicy = medios.ProgressPolicyForProfile(medios.ProfileTraining)
```

## 4. Read sandbox output

Capture `st.ContainerStatus.ContainerID.Value` on the first `TASK_RUNNING` update, then read `stdout` through `sandbox.Resolver`:

```go
r := &sandbox.Resolver{ControllerURL: "http://<controller>:5050"}
node, err := r.Locate(ctx, nodeID)
if err != nil {
    return err
}
p := node.PathFor(client.FrameworkID(), taskID, containerID, "stdout")
res, err := r.Read(ctx, node, p, 0, -1)
```

For bounded trailing log capture with automatic UTF-8 alignment and retry backoff, call `r.CaptureTail(ctx, nodeID, p, maxBytes, opts)`.

## What you built

You built a Go framework that preserves resource identity, attaches required principals, declines unwanted offers, acknowledges updates, and collects task output from node sandboxes.

## What's next

- [Packages & Helpers](/go-sdk/packages)
- [Example Frameworks](/go-sdk/examples)
- [Scheduler Contract & Best Practices](/frameworks/contract)
