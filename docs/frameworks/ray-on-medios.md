---
title: Ray on Medios
doc_type: concept
---

# Ray on Medios (`ray-medios`)

[`ray-medios`](https://github.com/medios-lab/ray-medios) is a KubeRay-compatible Medios framework (`v0.1.0`, preview) that runs the stock Ray `kuberay-autoscaler` on top of a Medios cluster.

Ray and Medios operate at different layers: Medios brokers node resources and enforces isolation; `ray-medios` translates Ray cluster and autoscaler intent into Medios resource offers and tasks.

## Compatibility

| Component | Supported version / mode |
| --- | --- |
| `medios` | `v0.1.14+` |
| `medios-sdk-go` | `v0.15.0` |
| Ray | `2.60.0` (stock `kuberay-autoscaler`) |
| Containerizers | `medios` and `docker_shell` |
| Release status | `v0.1.0` preview |

## Install

Install with Go:

```sh
go install github.com/medios-lab/ray-medios/cmd/ray-medios@v0.1.0
```

Or download a pre-built release archive from GitHub Releases:

```text
ray-medios_v0.1.0_linux_amd64.tar.gz
ray-medios_v0.1.0_linux_arm64.tar.gz
ray-medios_v0.1.0_darwin_arm64.tar.gz
```

## Authoritative documentation

Flags, runtime contracts, and worked examples live in `medios-lab/ray-medios`:

- [README](https://github.com/medios-lab/ray-medios/blob/main/README.md) — quickstart, flags, and configuration
- [Endpoint contract](https://github.com/medios-lab/ray-medios/blob/main/docs/endpoint-contract.md) — KubeRay-compatible API surface
- [Task mapping](https://github.com/medios-lab/ray-medios/blob/main/docs/task-mapping.md) — how Ray heads and workers map to Medios tasks
- [Examples](https://github.com/medios-lab/ray-medios/tree/main/examples) — runnable cluster configurations
- [Security](https://github.com/medios-lab/ray-medios/blob/main/SECURITY.md) — security model and reporting

## What's next

- [Building Frameworks](/frameworks)
- [Networking Model](/architecture/networking)
- [Go SDK](/go-sdk)
