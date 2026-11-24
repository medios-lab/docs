---
title: Quick-Start Guide
slug: /quick-start
doc_type: tutorial
---

# Quick-Start Guide

In about five minutes you start a local Medios controller and node, submit a task with `medios-execute`, and inspect its output.

:::info Onboarding distribution placeholder
The final pre-built installation method (macOS release tarballs and Docker images for Linux and other platforms) is being finalized as part of the onboarding-flow issue. Step 1 below is a placeholder; until pre-built artifacts are published, use [Build from Source](/installation/build-from-source) or [Docker Compose](/installation/docker).
:::

## What you need

- A Linux (`x86_64` or `arm64`) or macOS (`arm64`) machine.
- Three terminal windows.

## 1. Install Medios binaries (placeholder)

<!-- TBD: Replace with final macOS tarball / Docker image commands once the onboarding-flow issue closes. -->

Download or build the Medios binaries so `medios-controller`, `medios-node`, `medios-execute`, and `medios-executor` are available in `<medios-bin-dir>`.

## 2. Start the controller

In terminal 1, start `medios-controller` bound to loopback with an in-memory registry:

```sh
<medios-bin-dir>/medios-controller \
  --ip=127.0.0.1 --port=5050 \
  --registry=in_memory \
  --work_dir=/tmp/medios-controller
```

## 3. Start a node

In terminal 2, start `medios-node` pointing at the controller. `--launcher_dir` must point to the directory containing `medios-executor`:

```sh
<medios-bin-dir>/medios-node \
  --controller=127.0.0.1:5050 \
  --ip=127.0.0.1 --port=5051 \
  --work_dir=/tmp/medios-node \
  --containerizers=medios --launcher=posix --isolation= \
  --launcher_dir=<medios-bin-dir> \
  --resources='cpus:2;mem:1024;disk:1024'
```

## 4. Submit a task

In terminal 3, run a command task with `medios-execute`. On macOS, set `LIBPROCESS_IP=127.0.0.1` if your local hostname is not resolvable via DNS or `/etc/hosts`:

```sh
LIBPROCESS_IP=127.0.0.1 <medios-bin-dir>/medios-execute \
  --controller=127.0.0.1:5050 \
  --name=hello \
  --command='echo hello-medios'
```

Expected output:

```text
Subscribed with ID <framework-id>
Submitted task 'hello' to node <node-id>
Received status update TASK_STARTING for task 'hello'
Received status update TASK_RUNNING for task 'hello'
Received status update TASK_FINISHED for task 'hello'
```

## 5. Read the task output

The node captures task `stdout` and `stderr` inside its sandbox under `/tmp/medios-node/nodes/<node-id>/frameworks/<framework-id>/executors/hello/runs/<container-id>/stdout`:

```sh
cat /tmp/medios-node/nodes/*/frameworks/*/executors/hello/runs/*/stdout
```

```text
hello-medios
```

## Clean up

Stop the node and controller with `Ctrl-C`, then remove the temporary work directories:

```sh
rm -rf /tmp/medios-controller /tmp/medios-node
```

## What's next

- [Installation](/installation) — requirements, deployment modes, and building from source
- [Architecture](/architecture) — how offers, containerizers, and tasks fit together
- [Go SDK](/go-sdk) — write your first framework against this cluster
