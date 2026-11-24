---
title: Authorization & ACLs
doc_type: how-to
---

# Configure Authorization and ACLs

You end with `LocalAuthorizer` enforcing non-permissive access rules on both `medios-controller` and `medios-node`, including `ACT_FOR_PRINCIPAL` delegation for multi-user frameworks.

## Before you begin

- Authentication enabled on your controller and nodes (see [Authentication & Principals](/security/authentication)).

## 1. Write the controller ACL file (`acls.json`)

Save `/etc/medios/acls.json` with `"permissive": false` and explicit rules for node registration, framework registration, task execution, `ACT_FOR_PRINCIPAL` delegation, and operator read/inspection access:

```json
{
  "permissive": false,
  "register_nodes": [
    {
      "principals": { "type": "ANY" },
      "nodes": { "type": "ANY" }
    }
  ],
  "register_frameworks": [
    {
      "principals": { "values": ["team:ml-infra"] },
      "roles": { "type": "ANY" }
    }
  ],
  "run_tasks": [
    {
      "principals": { "values": ["team:ml-infra"] },
      "users": { "values": ["medios-worker"] }
    }
  ],
  "act_for_principals": [
    {
      "principals": { "values": ["team:ml-infra"] },
      "task_principals": { "values": ["operator:alice", "team:ml-infra"] }
    }
  ],
  "view_frameworks": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_tasks": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_executors": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_roles": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "roles": { "type": "ANY" }
    }
  ],
  "view_flags": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "flags": { "type": "ANY" }
    }
  ]
}
```

## 2. Write the node ACL file (`node_acls.json`)

`medios-node` authorizes local HTTP inspection, sandbox file reads (`/files/*`), and read-only store browsing (`/stores/<name>`) against its own ACL file. Save `/etc/medios/node_acls.json`:

```json
{
  "permissive": false,
  "view_frameworks": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_tasks": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_executors": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "type": "ANY" }
    }
  ],
  "view_flags": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "flags": { "type": "ANY" }
    }
  ],
  "access_sandboxes": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "users": { "values": ["medios-worker"] }
    }
  ],
  "get_endpoints": [
    {
      "principals": { "values": ["operator:admin", "team:ml-infra"] },
      "paths": {
        "values": [
          "/metrics/snapshot",
          "/containers",
          "/monitor/statistics",
          "/stores/training-v1"
        ]
      }
    }
  ]
}
```

## 3. Pass the ACLs to controller and node

On `medios-controller`:

```sh
medios-controller \
  --authorizers=local \
  --acls=file:///etc/medios/acls.json
```

On `medios-node`:

```sh
medios-node \
  --authorizer=local \
  --acls=file:///etc/medios/node_acls.json
```

## Clean up

Remove `--authorizers=local` / `--authorizer=local` and `--acls` flags and restart the daemons to revert to permissive defaults in development environments.

## What's next

- [Linux Hardening & Isolators](/security/hardening)
- [Authentication & Principals](/security/authentication)
