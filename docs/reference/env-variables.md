---
title: Environment Variables
doc_type: reference
---

# Environment Variables

Environment variables read by Medios daemons, clients, and helper binaries, plus variables injected into executors and finish hooks.

## Daemon flag variables

Every `medios-controller` and `medios-node` CLI flag can be supplied as `MEDIOS_<FLAG_NAME_IN_UPPERCASE>`. See [medios-controller](/cli/controller) and [medios-node](/cli/node).

## Transport and libprocess variables

| Variable | Applies to | Default | Description |
| --- | --- | --- | --- |
| `LIBPROCESS_IP` | Controller, node, `medios-execute` | Hostname lookup | Explicit IP address bound by libprocess. Set to `127.0.0.1` on macOS if the local hostname is unresolvable. |
| `LIBPROCESS_PORT` | Controller, node, `medios-execute` | Ephemeral | Explicit TCP port for libprocess sockets. |
| `LIBPROCESS_SSL_ENABLED` | All libprocess binaries | `false` | Enables TLS on libprocess sockets (requires SSL-enabled build). |
| `LIBPROCESS_SSL_VERIFY_SERVER_CERT` | All libprocess binaries | `false` | Verifies peer server certificates against the configured CA. |
| `LIBPROCESS_SSL_REQUIRE_CLIENT_CERT` | Controller, node | `false` | Requires mutual TLS client certificates on inbound connections. |
| `LIBPROCESS_SSL_VERIFY_IPADD` | All libprocess binaries | `false` | Validates peer IP SANs against the connection IP. |
| `LIBPROCESS_SSL_HOSTNAME_VALIDATION_SCHEME` | All libprocess binaries | `legacy` | Set to `openssl` for strict hostname/SAN validation. |
| `LIBPROCESS_SSL_CA_FILE` | All libprocess binaries | — | Path to PEM CA certificate bundle. |
| `LIBPROCESS_SSL_CERT_FILE` | All libprocess binaries | — | Path to host PEM certificate. |
| `LIBPROCESS_SSL_KEY_FILE` | All libprocess binaries | — | Path to host PEM private key (`chmod 0600`). |

## Fetcher variables

| Variable | Applies to | Default | Description |
| --- | --- | --- | --- |
| `MEDIOS_FETCHER_DISALLOW_PRIVATE_IPS` | `medios-node` / `medios-fetcher` | `false` | Blocks `http://` and `https://` artifact fetches to private/RFC1918/metadata IP addresses. |

## Variables injected into task finish hooks

`medios-executor` builds each [Task Finish Hook](/workloads/finish-hooks) environment from three sources in precedence order — `--executor_environment_variables`, then `TaskFinish.command.environment`, then four non-overridable variables:

| Variable | Description |
| --- | --- |
| `MEDIOS_WORK_EXIT_STATUS` | Exit code of the work command when it exited normally, or `128 + signal` when terminated by a signal (matching shell `$?`). |
| `MEDIOS_TASK_ID` | Value of the task's `TaskID`. |
| `MEDIOS_FRAMEWORK_ID` | Value of the framework's `FrameworkID`. |
| `MEDIOS_NODE_ID` | ID of the node the task ran on (set by `medios-node` on every executor; the finish hook does not start if missing). |
