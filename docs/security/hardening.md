---
title: Linux Hardening & Isolators
doc_type: how-to
---

# Harden Linux Nodes

You end with a Linux `medios-node` running non-root user switching, UNIX domain socket executor communication, stripped Linux capabilities, `no_new_privs`, seccomp, and fetcher egress guards.

## Before you begin

- A Linux host running `medios-node` as `root` (required to create cgroups, mount namespaces, and `setuid` to task users).
- Non-root OS accounts created on every node for each `FrameworkInfo.user` / `CommandInfo.user` value your frameworks submit.
- A Seccomp profile directory (for example `/etc/medios/seccomp`) containing a Docker/Moby-compatible Seccomp JSON profile (for example `default.json`).

## 1. Install a Seccomp profile

The `linux/seccomp` isolator **requires** `--seccomp_config_dir` at startup (if omitted, `medios-node` refuses to start). Profiles use the Docker/Moby Seccomp JSON schema (`defaultAction`, `architectures`, and `syscalls`):

```sh
sudo mkdir -p /etc/medios/seccomp
```

Place your default profile at `/etc/medios/seccomp/default.json` (for example the standard Moby `profiles/seccomp/default.json`, or a minimal allowlist profile matching your target architecture):

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64", "SCMP_ARCH_AARCH64"],
  "syscalls": [
    {
      "names": ["read", "write", "openat", "close", "fstat", "mmap", "mprotect", "munmap", "brk", "rt_sigaction", "rt_sigprocmask", "exit", "exit_group", "execve", "clone", "wait4", "futex"],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

Pass `--seccomp_profile_name=default.json` (relative to `--seccomp_config_dir`) to apply that profile by default to every Medios container. Tasks can override it per-container via `LinuxInfo.seccomp.profile_name` (or opt out with `LinuxInfo.seccomp.unconfined: true`).

## 2. Enable fetcher egress guards

Prevent `medios-fetcher` from reaching private RFC1918/loopback/metadata IPs (cloud metadata endpoints are always blocked by default):

```sh
export MEDIOS_FETCHER_DISALLOW_PRIVATE_IPS=true
```

## 3. Start `medios-node` with hardening flags

```sh
medios-node \
  --ip=<bind-ip> \
  --advertise_ip=<egress-ip> \
  --port=5051 \
  --controller=<controller-ip>:5050 \
  --work_dir=/var/lib/medios/node \
  --runtime_dir=/var/run/medios \
  --launcher_dir=<medios-bin-dir> \
  --switch_user=true \
  --http_executor_domain_sockets=true \
  --containerizers=medios \
  --launcher=linux \
  --isolation=cgroups/cpu,cgroups/mem,filesystem/linux,linux/capabilities,linux/nnp,linux/seccomp,namespaces/ipc,namespaces/pid,disk/du \
  --seccomp_config_dir=/etc/medios/seccomp \
  --seccomp_profile_name=default.json \
  --effective_capabilities='{"capabilities":[]}' \
  --bounding_capabilities='{"capabilities":[]}' \
  --fetcher_allow_local_uris=false
```

- `--launcher_dir` must point to the directory holding `medios-executor`, `medios-default-executor`, `medios-fetcher`, and `medios-containerizer`; omitting it causes command tasks to fail with `TASK_LOST`.
- The `environment/secret` isolator loads automatically under `medios`; you do not need to list it in `--isolation`.
- If you stage local artifacts on the node, set `--fetcher_allow_local_uris=true --fetcher_allowed_local_uri_prefix=/var/lib/medios/staging` to confine `file://` fetches to one directory.

## 4. Verify node flags

```sh
curl -s http://<bind-ip>:5051/flags
```

## Clean up

Stop `medios-node` and revert flags if testing on a staging host.

## What's next

- [Mutual TLS (mTLS)](/security/tls)
- [Authorization & ACLs](/security/authorization)
- [CLI Tools: medios-node](/cli/node)
