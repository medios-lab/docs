---
title: Declaring GPUs & Hardware
doc_type: how-to
---

# Declare GPUs and Hardware Units

In Medios, the operator declares what hardware a node offers. Medios verifies the declaration against the host at startup, refuses to start if the host cannot honor it, and enforces the declared units at container launch. Medios does not auto-discover devices to invent resource counts.

## Before you begin

- A Linux node with NVIDIA drivers installed and `nvidia-smi` working (`nvidia-smi -L` prints each device's UUID).
- The `libmedios_gpu.so` isolator module built and available on the node (module name `com_medioslab_medios_gpu`).

## 1. Write the GPU units declaration (`gpu-units.json`)

Create `/etc/medios/gpu-units.json` declaring each GPU resource name, how many units one physical device provides (`per_device`), and the NVML driver UUIDs backing it:

```json
{
  "units": [
    {
      "resource": "gpus",
      "per_device": 1,
      "devices": [
        "GPU-11111111-2222-3333-4444-555555555555",
        "GPU-66666666-7777-8888-9999-aaaaaaaaaaaa"
      ]
    }
  ]
}
```

- `resource` (string, required): scalar resource name exposed in `--resources` (for example `"gpus"`).
- `per_device` (integer `>= 1`, required): units provided per physical GPU (`1` for exclusive whole-device allocation; `N > 1` for time-sliced sharing).
- `devices` (string array, required): NVIDIA driver UUIDs from `nvidia-smi -L`. Every listed UUID must be discovered on the host at startup or module load fails.
- Retired fields `mode`, `count`, and `occupancy` are refused at startup.

## 2. Write the module manifest (`gpu-module.json`)

Create `/etc/medios/gpu-module.json` loading `libmedios_gpu.so`, naming `com_medioslab_medios_gpu`, and pointing its `units` parameter at `/etc/medios/gpu-units.json`:

```json
{
  "libraries": [
    {
      "file": "/usr/local/lib/libmedios_gpu.so",
      "modules": [
        {
          "name": "com_medioslab_medios_gpu",
          "parameters": [
            {
              "key": "units",
              "value": "/etc/medios/gpu-units.json"
            }
          ]
        }
      ]
    }
  ]
}
```

## 3. Declare the GPU resource on `medios-node`

Pass the total declared scalar (`per_device * devices.length`) in `--resources`, load the manifest with `--modules`, and enable `com_medioslab_medios_gpu` in `--isolation`:

```sh
medios-node \
  --controller=<controller>:5050 \
  --ip=<node-ip> --port=5051 \
  --work_dir=/var/lib/medios/node \
  --launcher_dir=<medios-bin-dir> \
  --containerizers=medios \
  --launcher=linux \
  --isolation=cgroups/cpu,cgroups/mem,filesystem/linux,com_medioslab_medios_gpu \
  --modules=file:///etc/medios/gpu-module.json \
  --resources='cpus:16;mem:65536;disk:204800;gpus:2'
```

At startup, `com_medioslab_medios_gpu` verifies every declared device UUID against NVML on the host. If a declared device is missing or unreadable, `medios-node` exits with an explicit error naming the invalid unit.

:::note `docker_shell` GPU nodes
On `--containerizers=docker_shell` nodes, `com_medioslab_medios_gpu` is not used. Instead, declare whole GPU counts in `--resources='...;gpus:2'`; `docker_shell` maps granted whole GPUs to Docker device indices `0..N-1` via `--gpus` and `NVIDIA_VISIBLE_DEVICES` (containers granted 0 GPUs get `NVIDIA_VISIBLE_DEVICES=void`). Fractional GPU grants are refused on `docker_shell`, and GPU assignments are not recovered across `medios-node` restarts.
:::

## 4. Request GPUs from a framework

On `medios-controller`, `--filter_gpu_resources` defaults to `false`, so offers from GPU-bearing nodes go to every framework by default (a framework that does not carve `gpus` does not receive any GPU devices).

When a cluster operator enables `--filter_gpu_resources=true`, offers from GPU-bearing nodes — including their CPUs and memory — go **only** to frameworks that declare `GPU_RESOURCES` in `FrameworkInfo.capabilities`. Include `{"type": "GPU_RESOURCES"}` in `FrameworkInfo.capabilities` so your framework receives GPU node offers under either controller setting.

Carve the `gpus` scalar out of the received offer and include it on `TaskInfo.resources`.

## Clean up

Remove `com_medioslab_medios_gpu` from `--isolation`, remove `--modules`, remove the `gpus` entry from `--resources`, and restart `medios-node` to stop advertising GPUs on that host.

## What's next

- [Scheduler Contract & Best Practices](/frameworks/contract)
- [Multi-Node Gang Admission](/workloads/gang-admission)
- [Task, Container & Observer Fields](/reference/task-fields)
