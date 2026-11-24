---
title: medios-local & Helper Binaries
doc_type: reference
---

# medios-local & Helper Binaries

Auxiliary binaries shipped alongside `medios-controller` and `medios-node`.

## `medios-local`

Runs an in-process controller and one or more nodes inside a single OS process for local smoke testing.

```sh
medios-local --ip=127.0.0.1 --work_dir=/tmp/medios-local --launcher_dir=<medios-bin-dir>
```

## Node helper binaries (`--launcher_dir`)

`medios-node` locates these binaries inside the directory passed to `--launcher_dir`:

| Binary | When invoked |
| --- | --- |
| `medios-executor` | Default command executor for tasks with `command` and no custom `executor`. |
| `medios-docker-executor` | Executor forked by `--containerizers=docker_shell` to manage `docker run` / `stop` / `kill`. |
| `medios-default-executor` | Executor for `LAUNCH_GROUP` multi-task groups under `--containerizers=medios`. |
| `medios-fetcher` | Downloads and optionally extracts `command.uris` into the task sandbox before launch. |
| `medios-containerizer` | Helper binary used by `--containerizers=medios` for isolated container launch. |
