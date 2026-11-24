---
title: Authentication & Principals
doc_type: concept
---

# Authentication & Principals

Medios separates **who authenticates a connection** (the authenticator) from **who a task runs on behalf of** (two-tier principal attribution).

## Authenticators

| Authenticator | Use case | Configuration |
| --- | --- | --- |
| `identity_assertion` (default) | Loopback and trusted single-team overlay clusters | Framework asserts its principal without cryptographic verification |
| `basic` | Multi-host deployments using shared credentials files | `--http_authenticators=basic --http_framework_authenticators=basic --credentials=file:///etc/medios/credentials.json` (and `--http_credentials=file:///etc/medios/http_credentials.json` on `medios-node`) |
| `trusted_header` | Deployments behind an authenticating reverse proxy or edge gateway | `--http_framework_authenticators=trusted_header` (reads the `X-Medios-Principal` HTTP header) |

## Credentials file schema (`credentials.json` and `http_credentials.json`)

Both `medios-controller --credentials` and `medios-node --http_credentials` read the same `Credentials` JSON schema (`principal` and `secret` pairs). Restrict file permissions to `chmod 0600` owned by the daemon user (`medios-controller` / `medios-node` log a warning if world-readable):

```json
{
  "credentials": [
    {
      "principal": "operator:admin",
      "secret": "<operator-secret>"
    },
    {
      "principal": "team:ml-infra",
      "secret": "<framework-secret>"
    }
  ]
}
```

Enable HTTP Basic authentication on `medios-controller`:

```sh
medios-controller \
  --authenticate_http_readwrite=true \
  --authenticate_http_readonly=true \
  --authenticate_http_frameworks=true \
  --http_authenticators=basic \
  --http_framework_authenticators=basic \
  --credentials=file:///etc/medios/credentials.json
```

Enable HTTP Basic authentication on `medios-node`:

```sh
medios-node \
  --authenticate_http_readwrite=true \
  --authenticate_http_readonly=true \
  --http_authenticators=basic \
  --http_credentials=file:///etc/medios/http_credentials.json \
  ...
```

## `trusted_header` authentication (`X-Medios-Principal`)

When `--http_framework_authenticators=trusted_header` (or `--http_authenticators=trusted_header`) is configured, the daemon authenticates each request using the **`X-Medios-Principal`** HTTP header (scheme `Medios-Trusted-Header`). Surrounding whitespace is trimmed; a missing or blank header fails closed with `401 Unauthorized`.

:::warning Reverse proxy requirement
Only enable `trusted_header` when `medios-controller` or `medios-node` is unreachable except through your authenticating gateway, and configure the gateway to **strip any client-supplied `X-Medios-Principal` header** before injecting the verified identity.
:::

## Two-tier principal attribution

Every task carries two distinct identities:

1. **Framework principal (`FrameworkInfo.principal`):** identifies the scheduling framework itself.
2. **Task submitter principal (`TaskInfo.principal`, required):** identifies the actor on whose behalf the task runs, formatted as `<kind>:<name>` where `<kind>` is `operator`, `team`, or `run` (for example `operator:alice`, `team:ml-infra`, or `run:eval-42`).

The controller refuses any `ACCEPT` carrying a task without a valid `TaskInfo.principal` and records both `TaskStatus.principal` and `TaskStatus.framework_principal` on status updates for auditability.

## What's next

- [Authorization & ACLs](/security/authorization)
- [Mutual TLS (mTLS)](/security/tls)
