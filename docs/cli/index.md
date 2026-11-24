---
title: CLI Tools
slug: /cli
doc_type: concept
---

# CLI Tools

A Medios installation consists of two long-running daemons, two developer/operator CLIs, and five node-side helper binaries loaded from `--launcher_dir`.

| Binary | Role | Reference |
| --- | --- | --- |
| `medios-controller` | Cluster coordinator daemon | [medios-controller](/cli/controller) |
| `medios-node` | Machine-side execution daemon | [medios-node](/cli/node) |
| `medios-execute` | Single-task submission CLI | [medios-execute](/cli/execute) |
| `medios-local` | Single-process local controller + node for testing | [medios-local & Helper Binaries](/cli/helpers) |
| `medios-executor`, `medios-docker-executor`, `medios-default-executor`, `medios-fetcher`, `medios-containerizer` | Node helper binaries invoked from `--launcher_dir` | [medios-local & Helper Binaries](/cli/helpers) |

Every `medios-controller` and `medios-node` flag can also be supplied via an environment variable with the `MEDIOS_` prefix (for example `--work_dir=/var/lib/medios` is equivalent to `MEDIOS_WORK_DIR=/var/lib/medios`). CLI flags take precedence over environment variables.
