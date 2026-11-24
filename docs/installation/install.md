---
title: Install Binaries & Images
doc_type: how-to
---

# Install Binaries & Images

:::info Onboarding flow placeholder
Distribution packaging is being finalized under the onboarding-flow issue:

- **macOS (`arm64`):** planned as signed/checksummed release tarballs from GitHub Releases.
- **Linux & other platforms:** planned as official container images (plus optional Linux release tarballs).

Until packaging lands, use [Docker Compose](/installation/docker) or [Build from Source](/installation/build-from-source).
:::

## Planned release layout

When installed from a release archive into `<install-prefix>`, the binary tree looks like:

```text
<install-prefix>/
├── bin/
│   ├── medios-controller
│   ├── medios-node
│   ├── medios-execute
│   └── medios-local
└── libexec/medios/          # pass as --launcher_dir
    ├── medios-executor
    ├── medios-docker-executor
    ├── medios-default-executor
    ├── medios-fetcher
    └── medios-containerizer
```

## Planned sections (to be populated once onboarding lands)

1. Installing on macOS from a release tarball (`curl` + SHA-256 verification + `launchd` plist).
2. Running controller and node from container images on Linux (`docker run` / `systemd`).
3. Verifying the install (`medios-controller --version`, `/health`, and `/openapi.json`).

## What's next

- [Docker Compose](/installation/docker)
- [Build from Source](/installation/build-from-source)
- [Uninstalling Medios](/installation/uninstall)
