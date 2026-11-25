---
title: Quick-Start Guide
slug: /quick-start
doc_type: tutorial
---

# Quick-Start Guide

In about five minutes you start a local Medios controller and node, submit a task with `medios-execute`, and inspect its output.

:::tip Let your coding agent do it
Paste `Try Medios: https://medios-lab.github.io/try.txt` into Codex, Claude Code or Antigravity. The agent installs Medios in one directory, starts a controller and a node, and runs a first framework. This page covers the same ground by hand.
:::

## What you need

- A Linux (`x86_64` or `arm64`) or macOS (`arm64`) machine.
- Three terminal windows.

## 1. Install Medios binaries

Download a release archive from [GitHub Releases](https://github.com/medios-lab/medios/releases), check it, and unpack it into `./medios`. Archive names carry the release's commit and the platform:

```sh
VERSION=v0.1.14
COMMIT=51a5f22e95d35ea56d3faead48be5d41ccbfbbf1
PLATFORM=darwin-arm64        # or linux-amd64, linux-arm64
NAME=medios-$COMMIT-$PLATFORM
BASE=https://github.com/medios-lab/medios/releases/download/$VERSION

curl -fsSLO $BASE/$NAME.tar.gz
curl -fsSLO $BASE/$NAME.tar.gz.sha256
shasum -a 256 -c $NAME.tar.gz.sha256      # Linux without shasum: sha256sum -c
mkdir medios && tar -xzf $NAME.tar.gz -C medios --strip-components 1
medios/bin/medios-controller --version
```

The binaries are in `medios/bin`; the libraries they load are in `medios/lib`. The commands below use `<medios-bin-dir>` for the absolute path of `medios/bin`.

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

Expected output, after the log lines:

```text
Submitted task 'hello' to node '<node-id>'
Received status update TASK_STARTING for task 'hello'
  source: SOURCE_EXECUTOR
Received status update TASK_RUNNING for task 'hello'
  source: SOURCE_EXECUTOR
Received status update TASK_FINISHED for task 'hello'
  message: 'Command exited with status 0'
  source: SOURCE_EXECUTOR
```

## 5. Read the task output

The node captures task `stdout` and `stderr` inside its sandbox under `/tmp/medios-node/nodes/<node-id>/frameworks/<framework-id>/executors/hello/runs/<container-id>/stdout`. `runs/latest` links to the most recent run:

```sh
cat /tmp/medios-node/nodes/*/frameworks/*/executors/hello/runs/latest/stdout
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
