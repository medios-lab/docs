---
title: Security
slug: /security
doc_type: concept
---

# Security

Medios defaults to low-ceremony local development (`identity_assertion` authentication and loopback binding) and activates production security controls through explicit flags as a cluster crosses trust boundaries.

## Security controls by deployment mode

| Control | Mode 1: Standalone Laptop | Mode 2: Private Lab / Overlay | Mode 3: Cloud / Multi-Host |
| --- | --- | --- | --- |
| **Network binding** | `127.0.0.1` loopback | Encrypted overlay IP (WireGuard / Tailscale) + host firewall | Routable IP + mutual TLS |
| **Transport encryption** | Plaintext loopback | Overlay encryption | `LIBPROCESS_SSL_ENABLED=true` with mutual cert verification |
| **HTTP & framework auth** | `identity_assertion` | `identity_assertion` + explicit principals | `basic` or `trusted_header` + `--authenticate_http_*=true` |
| **Authorization** | Permissive | Permissive | `--authorizers=local` with non-permissive ACL files |
| **User isolation** | `--switch_user=false` | `--switch_user=true` | `--switch_user=true` |
| **Executor transport** | UNIX domain sockets | UNIX domain sockets | UNIX domain sockets |
| **Linux kernel hardening** | Optional | Recommended | Capabilities drop, NNP, seccomp, PID/IPC/mount namespaces |
| **Fetcher egress guard** | Default | Default | `MEDIOS_FETCHER_DISALLOW_PRIVATE_IPS=true`, `--fetcher_allow_local_uris=false` |

## Security guides

- [Mutual TLS (mTLS)](/security/tls) — build and configure mutual TLS across controller, nodes, executors, and frameworks.
- [Authentication & Principals](/security/authentication) — configure authenticators and two-tier principal attribution.
- [Authorization & ACLs](/security/authorization) — write `LocalAuthorizer` ACLs for controller and nodes.
- [Linux Hardening & Isolators](/security/hardening) — user switching, domain sockets, capabilities, seccomp, and fetcher guards.
