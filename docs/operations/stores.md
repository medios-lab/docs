---
title: Shared Dataset Stores
doc_type: how-to
---

# Configure Shared Dataset Stores

A shared dataset store lets an operator expose a host directory as a named shared resource `store/<name>` with declared class, locality, and reader/writer unit capacities. Tasks request a store by name and access mode (`STORE` volumes) rather than naming arbitrary host paths.

## Before you begin

- **Linux (`medios` containerizer):** `medios-node` must run with `--launcher=linux` and `--isolation=filesystem/linux`. Read-only mounts are enforced by the Linux kernel via a bind mount followed by a non-recursive read-only remount (`MS_BIND | MS_REMOUNT | MS_RDONLY`), and read-write mounts use `MS_BIND | MS_REC`.
- **macOS / POSIX (`medios` containerizer):** `--launcher=posix` and `--isolation=filesystem/posix` deliver stores as symlinks inside the task sandbox (`container_path` must be a single relative name; absolute paths are refused). Because symlinks cannot enforce kernel read-only protection, declare `"readers": 0` on POSIX/macOS stores and request them `RW`.
- **`docker_shell` containerizer:** `medios-docker-executor` resolves `STORE` volumes from the node's `--stores` file and passes them to `docker run` as `--volume` mounts (`:ro` for `RO`).
- A host directory containing the dataset (for example `/srv/datasets/training-v1`), readable by `medios-node`.

## 1. Create the stores declaration file

Save `/etc/medios/stores.json`. Every entry in `"stores"` requires all six fields:

| Field | Required | Allowed values |
| --- | --- | --- |
| `name` | Yes | Unique store identifier matching `[A-Za-z0-9._-]+`. Advertised as `store/<name>`. |
| `path` | Yes | Absolute host path that exists and is readable by `medios-node`. |
| `class` | Yes | `"local"` or `"shared"` (`"object"` is refused). |
| `locality` | Yes | `"near"`, `"same-site"`, or `"remote"`. |
| `readers` | Yes | Whole number `>= 0` of concurrent `RO` task holders (`0` disables `RO`). |
| `writers` | Yes | Whole number `>= 0` of concurrent `RW` task holders (`0` disables `RW`). |

At least one of `readers` or `writers` must be greater than `0`.

```json
{
  "stores": [
    {
      "name": "training-v1",
      "path": "/srv/datasets/training-v1",
      "class": "local",
      "locality": "near",
      "readers": 16,
      "writers": 1
    }
  ]
}
```

## 2. Pass `--stores` to `medios-node`

```sh
medios-node \
  --controller=<controller>:5050 \
  --ip=<node-ip> --port=5051 \
  --work_dir=/var/lib/medios/node \
  --launcher_dir=<medios-bin-dir> \
  --containerizers=medios \
  --launcher=linux \
  --isolation=filesystem/linux,cgroups/cpu,cgroups/mem \
  --stores=file:///etc/medios/stores.json
```

At startup, `medios-node` verifies that every declared path exists and is readable, and advertises each store in `Offer.resources` as a shared scalar resource with metadata labels:

```json
{
  "name": "store/training-v1",
  "type": "SCALAR",
  "scalar": {"value": 1.0},
  "shared": {},
  "metadata": {
    "labels": [
      {"key": "class", "value": "local"},
      {"key": "locality", "value": "near"},
      {"key": "readers", "value": "16"},
      {"key": "writers", "value": "1"}
    ]
  }
}
```

## 3. Subscribe and mount a store on a task

### `SHARED_RESOURCES` capability

On `medios-controller`, `--filter_shared_resources` defaults to `false`, so shared `store/<name>` resources are offered to all frameworks by default. When a cluster operator enables `--filter_shared_resources=true` (and always for `CREATE` shared persistent volumes), the allocator strips shared resources from offers unless the framework declares `SHARED_RESOURCES` in `FrameworkInfo.capabilities`. Always include `{"type": "SHARED_RESOURCES"}` in `FrameworkInfo.capabilities` for frameworks that mount stores so they work under both controller policies.

### Task resource and `STORE` volume

A task mounting a store must do **both** of the following:

1. Copy the offered shared `store/<name>` resource (preserving `shared: {}`, `metadata`, role, and `allocation_info`) into `TaskInfo.resources`.
2. Attach a `Volume` in `TaskInfo.container.volumes` with `source.type = "STORE"`:

```json
{
  "container": {
    "type": "MEDIOS",
    "volumes": [
      {
        "container_path": "/data",
        "mode": "RO",
        "source": {
          "type": "STORE",
          "store": {
            "name": "training-v1",
            "exclusive": false
          }
        }
      }
    ]
  }
}
```

### Locking and access semantics

The controller enforces reader and writer unit accounting per node at task validation time:

- **Read-only (`mode: "RO"`, `exclusive: false` or unset):** consumes one reader unit (fails if `readers == 0` or `held_readers >= readers`). Setting `exclusive: true` on an `RO` volume is refused with `TASK_ERROR`.
- **Shared read-write (`mode: "RW"`, `exclusive: false`):** consumes one writer unit (fails if `writers == 0` or `held_writers >= writers`).
- **Exclusive read-write (`mode: "RW"`, `exclusive: true`):** requires `writers > 0` and zero currently active writers (`held_writers == 0`), taking every writer unit so no other writer can mount the store concurrently. Reader units are accounted independently on the reader pool — `exclusive: true` blocks concurrent **writers only**, not concurrent `RO` readers.

Only `STORE` volumes are accepted on `TaskInfo.container.volumes`; `HOST_PATH` and other volume sources are refused with `TASK_ERROR` (`REASON_TASK_INVALID`).

## 4. Browse store files over HTTP

Nodes expose declared stores read-only under `/stores/<name>` using the node files API (protected by `get_endpoints` ACLs when authorization is enabled).

## Clean up

Drain tasks holding units on the store, remove the entry from `/etc/medios/stores.json`, and restart `medios-node`.

## What's next

- [Writing a Framework in Go](/go-sdk/writing-a-framework) — using `task.WithStore` and `ClusterView`
- [Containerizers & Isolation](/architecture/containerizers)
- [Scheduler Contract & Best Practices](/frameworks/contract)
