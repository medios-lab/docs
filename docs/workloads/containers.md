---
title: Running Container Tasks
doc_type: how-to
---

# Run Container Tasks

You end with an OCI image task running on either a `medios` containerizer node or a `docker_shell` node.

## Before you begin

- Know which containerizer your target node runs (`medios` or `docker_shell`). Check `GET http://<node>:5051/flags` for `containerizers`.

## Option A: Run an OCI image on a `medios` node

Submit `container.type = "MEDIOS"` with `container.medios.image`:

```json
{
  "name": "oci-hello",
  "task_id": {"value": "oci-hello-1"},
  "node_id": {"value": "<node-id>"},
  "principal": "operator:alice",
  "resources": [
    {"name": "cpus", "type": "SCALAR", "scalar": {"value": 0.5}},
    {"name": "mem", "type": "SCALAR", "scalar": {"value": 256}}
  ],
  "container": {
    "type": "MEDIOS",
    "medios": {
      "image": {
        "type": "DOCKER",
        "docker": {"name": "alpine:latest"}
      }
    }
  },
  "command": {"shell": true, "value": "echo hello-from-oci"}
}
```

## Option B: Run a Docker image on a `docker_shell` node

Submit `container.type = "DOCKER"` with `container.docker`:

```json
{
  "name": "docker-hello",
  "task_id": {"value": "docker-hello-1"},
  "node_id": {"value": "<node-id>"},
  "principal": "operator:alice",
  "resources": [
    {"name": "cpus", "type": "SCALAR", "scalar": {"value": 0.5}},
    {"name": "mem", "type": "SCALAR", "scalar": {"value": 256}}
  ],
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "alpine:latest",
      "network": "HOST"
    }
  },
  "command": {"shell": true, "value": "echo hello-from-docker"}
}
```

## Clean up

Containers stop and exit automatically once the command finishes.

## What's next

- [Containerizers & Isolation](/architecture/containerizers)
- [Task, Container & Observer Fields](/reference/task-fields)
