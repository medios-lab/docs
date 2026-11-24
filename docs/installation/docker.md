---
title: Docker Compose
doc_type: how-to
---

# Run Medios with Docker Compose

You end with a networked controller and node running in Ubuntu 24.04 containers with persistent build artifacts.

## Before you begin

- Docker Desktop, Colima, OrbStack, or Linux `dockerd` with `docker compose` available: `docker compose version` prints a version.
- A clone of `https://github.com/medios-lab/medios`.

## 1. Build the development image

```sh
docker compose build
```

## 2. Start the controller and node

```sh
docker compose up
```

The compose network exposes the controller as hostname `controller` on port `5050` and connects the node automatically.

## 3. Run commands inside the container

Open a shell inside the controller container if you want to compile or run `medios-execute`:

```sh
docker compose run --rm controller bash
```

:::caution Cgroups inside Docker on macOS
Linux cgroups inside a macOS Docker VM are lossy. Use Docker Compose on macOS to verify the offer and task API loop end-to-end; use a native Linux host for production isolation testing.
:::

## Clean up

```sh
docker compose down
```

## What's next

- [Quick-Start Guide](/quick-start)
- [Build from Source](/installation/build-from-source)
