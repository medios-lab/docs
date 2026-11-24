---
title: medios-node
doc_type: reference
---

# medios-node

Flags accepted by `medios-node`, the machine-side daemon. Every flag can also be passed as an environment variable with the `MEDIOS_` prefix.

## Network & Binding

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--controller` | `MEDIOS_CONTROLLER` | — | May be one of: `host:port` `etcd://host:port/<election-name>` (detect the leading controller through the etcd v3 election service) |
| `--controller_detector` | `MEDIOS_CONTROLLER_DETECTOR` | — | The symbol name of the controller detector to use. This symbol should exist in a module specified through the --modules flag. Cannot be used in conjunction with --controller. |
| `--ip` | `MEDIOS_IP` | — | IP address to listen on. This cannot be used in conjunction with `--ip_discovery_command`. |
| `--ip6` | `MEDIOS_IP6` | — | IPv6 address to listen on. This cannot be used in conjunction with '--ip6_discovery_command'. NOTE: Currently Medios doesn't listen on IPv6 sockets and hence this IPv6 address is only used to advertise IPv6 addresses for containers running on the host network. |
| `--port` | `MEDIOS_PORT` | `5051` | Port to listen on. |
| `--advertise_ip` | `MEDIOS_ADVERTISE_IP` | — | IP address advertised to reach this Medios node. The node does not bind to this IP address. However, this IP address may be used to access this node. |
| `--advertise_port` | `MEDIOS_ADVERTISE_PORT` | — | Port advertised to reach this Medios node (along with `advertise_ip`). The node does not bind to this port. However, this port (along with `advertise_ip`) may be used to access this node. |
| `--hostname` | `MEDIOS_HOSTNAME` | — | The hostname the node should report. If left unset, the hostname is resolved from the IP address that the node advertises; unless the user explicitly prevents that, using `--no-hostname_lookup`, in which case the IP itself is used. |
| `--hostname_lookup` | `MEDIOS_HOSTNAME_LOOKUP` | `true` | Whether we should execute a lookup to find out the server's hostname, if not explicitly set (via, e.g., `--hostname`). True by default; if set to `false` it will cause Medios to use the IP address, unless the hostname is explicitly set. |
| `--ip_discovery_command` | `MEDIOS_IP_DISCOVERY_COMMAND` | — | Optional IP discovery binary: if set, it is expected to emit the IP address which the node will try to bind to. Cannot be used in conjunction with `--ip`. |
| `--ip6_discovery_command` | `MEDIOS_IP6_DISCOVERY_COMMAND` | — | Optional IPv6 discovery binary: if set, it is expected to emit the IPv6 address on which Medios will try to bind when IPv6 socket support is enabled in Medios. |
| `--domain` | `MEDIOS_DOMAIN` | — | Domain that the node belongs to. Medios currently only supports fault domains, which identify groups of hosts with similar failure characteristics. A fault domain consists of a region and a zone. |
| `--firewall_rules` | `MEDIOS_FIREWALL_RULES` | — | The value could be a JSON-formatted string of rules or a file path containing the JSON-formatted rules used in the endpoints firewall. Path must be of the form `file:///path/to/file` or `/path/to/file`. See the `Firewall` message in `flags.proto` for the expected format. |

## Containerizer, Isolation & Linux Security

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--containerizers` | `MEDIOS_CONTAINERIZERS` | `medios` | Single containerizer backend for this node: either `medios` (default) or `docker_shell`. Passing multiple comma-separated containerizers is rejected at startup. |
| `--launcher` | `MEDIOS_LAUNCHER` | `linux` (Linux) / `posix` (macOS) | Task launcher used by the `medios` containerizer: `linux` (clone namespaces/cgroups, default on Linux when available) or `posix` (default on macOS). |
| `--launcher_dir` | `MEDIOS_LAUNCHER_DIR` | `<install-prefix>/libexec/medios` | Directory containing Medios helper binaries (`medios-executor`, `medios-default-executor`, `medios-docker-executor`, `medios-fetcher`, `medios-containerizer`). Required for command and Docker tasks. |
| `--isolation` | `MEDIOS_ISOLATION` | `posix/cpu,posix/mem` | Comma-separated list of isolators enabled by the `medios` containerizer (for example `cgroups/cpu,cgroups/mem,filesystem/linux,com_medioslab_medios_gpu`). |
| `--switch_user` | `MEDIOS_SWITCH_USER` | `true` | If set to `true`, the node will attempt to run tasks as the `user` who submitted them (as defined in `FrameworkInfo`) (this requires `setuid` permission and that the given `user` exists on the node). If the user does not exist, an error occurs and the task will fail. |
| `--sandbox_directory` | `MEDIOS_SANDBOX_DIRECTORY` | `/mnt/medios/sandbox` | The absolute path for the directory in the container where the sandbox is mapped to. |
| `--default_container_info` | `MEDIOS_DEFAULT_CONTAINER_INFO` | — | JSON-formatted ContainerInfo that will be included into any ExecutorInfo that does not specify a ContainerInfo. See the ContainerInfo protobuf in medios.proto for the expected format. |
| `--image_providers` | `MEDIOS_IMAGE_PROVIDERS` | — | Comma-separated list of supported image providers, e.g., `DOCKER`. |
| `--image_provisioner_backend` | `MEDIOS_IMAGE_PROVISIONER_BACKEND` | — | Strategy for provisioning container rootfs from images, e.g., `aufs`, `bind`, `copy`, `overlay`. |
| `--image_gc_config` | `MEDIOS_IMAGE_GC_CONFIG` | — | JSON-formatted configuration for automatic container image garbage collection. This is an optional flag. If it is not set, it means the automatic container image gc is not enabled. Users have to trigger image gc manually via the operator API. |
| `--docker_registry` | `MEDIOS_DOCKER_REGISTRY` | `https://registry-1.docker.io` | Default OCI/Docker registry URL (or local image archive directory) used by the `medios` containerizer to pull Docker images. |
| `--docker_store_dir` | `MEDIOS_DOCKER_STORE_DIR` | `/tmp/medios/store/docker` | Directory the Docker provisioner will store images in |
| `--docker_ignore_runtime` | `MEDIOS_DOCKER_IGNORE_RUNTIME` | `false` | Ignore any runtime configuration specified in the Docker image. The Medios containerizer will not propagate Docker runtime specifications such as `WORKDIR`, `ENV` and `CMD` to the container. |
| `--docker_config` | `MEDIOS_DOCKER_CONFIG` | — | Default Docker registry auth config file path or JSON string used when pulling private images. |
| `--cgroups_destroy_timeout` | `MEDIOS_CGROUPS_DESTROY_TIMEOUT` | `60secs` | Amount of time allowed to destroy a cgroup hierarchy. If the cgroup hierarchy is not destroyed within the timeout, the corresponding container destroy is considered failed. |
| `--cgroups_hierarchy` | `MEDIOS_CGROUPS_HIERARCHY` | `/sys/fs/cgroup` | Base path to the Linux cgroups hierarchy (used for cgroups v1 and v2). |
| `--cgroups_root` | `MEDIOS_CGROUPS_ROOT` | `medios` | Name of the root cgroup |
| `--cgroups_enable_cfs` | `MEDIOS_CGROUPS_ENABLE_CFS` | `false` | Cgroups feature flag to enable hard limits on CPU resources via the CFS bandwidth limiting subfeature. |
| `--cgroups_limit_swap` | `MEDIOS_CGROUPS_LIMIT_SWAP` | `false` | Cgroups feature flag to enable memory limits on both memory and swap instead of just memory. On cgroups v2 a container's swap is limited to zero, so a container at its memory limit is OOM killed rather than continuing in swap. |
| `--cgroups_cpu_enable_pids_and_tids_count` | `MEDIOS_CGROUPS_CPU_ENABLE_PIDS_AND_TIDS_COUNT` | `false` | Cgroups feature flag to enable counting of processes and threads inside a container. |
| `--cgroups_net_cls_primary_handle` | `MEDIOS_CGROUPS_NET_CLS_PRIMARY_HANDLE` | — | A non-zero, 16-bit handle of the form `0xAAAA`. This will be used as the primary handle for the net_cls cgroup. |
| `--cgroups_net_cls_secondary_handles` | `MEDIOS_CGROUPS_NET_CLS_SECONDARY_HANDLES` | — | Range of the form `0xAAAA,0xBBBB` specifying valid secondary handles paired with `--cgroups_net_cls_primary_handle`. |
| `--allowed_devices` | `MEDIOS_ALLOWED_DEVICES` | — | JSON array representing the devices that will be additionally allowlisted by the cgroups devices subsystem. |
| `--node_subsystems` | `MEDIOS_NODE_SUBSYSTEMS` | — | List of comma-separated cgroup subsystems to run the node binary in, e.g., `memory,cpuacct`. The default is none. Present functionality is intended for resource monitoring and no cgroup limits are set, they are inherited from the root medios cgroup. |
| `--effective_capabilities` | `MEDIOS_EFFECTIVE_CAPABILITIES` | — | JSON representation of the Linux capabilities that the node will grant to a task that will be run in containers launched by the containerizer (currently only supported by the Medios Containerizer). |
| `--bounding_capabilities` | `MEDIOS_BOUNDING_CAPABILITIES` | — | JSON representation of the Linux capabilities that the operator will allow as the maximum level of privilege that a task launched by the containerizer may acquire (currently only supported by the Medios Containerizer). |
| `--seccomp_config_dir` | `MEDIOS_SECCOMP_CONFIG_DIR` | — | Directory containing Docker/Moby-compatible Seccomp JSON profiles. Required whenever `linux/seccomp` is enabled in `--isolation`. |
| `--seccomp_profile_name` | `MEDIOS_SECCOMP_PROFILE_NAME` | — | Default Seccomp profile filename relative to `--seccomp_config_dir`, applied to every Medios container unless overridden per task. |
| `--default_container_shm_size` | `MEDIOS_DEFAULT_CONTAINER_SHM_SIZE` | — | The default size of the /dev/shm for the container which has its own /dev/shm but does not specify the `shm_size` field in its `LinuxInfo`. |
| `--disallow_sharing_node_ipc_namespace` | `MEDIOS_DISALLOW_SHARING_NODE_IPC_NAMESPACE` | `false` | If set to `true`, each top-level container will have its own IPC namespace and /dev/shm, and if the framework requests to share the node IPC namespace and /dev/shm for the top level container, the container launch will be rejected. |
| `--disallow_sharing_node_pid_namespace` | `MEDIOS_DISALLOW_SHARING_NODE_PID_NAMESPACE` | `false` | If set to `true`, each top-level container will have its own pid namespace, and if the framework requests to share the node pid namespace for the top level container, the container launch will be rejected. |
| `--systemd_enable_support` | `MEDIOS_SYSTEMD_ENABLE_SUPPORT` | `true` | Top level control of systemd support. When enabled, features such as executor life-time extension are enabled unless there is an explicit flag to disable these (see other flags). This should be enabled when the node is launched as a systemd unit. |
| `--systemd_runtime_directory` | `MEDIOS_SYSTEMD_RUNTIME_DIRECTORY` | `/run/systemd/system` | The path to the systemd system run time directory |

## Resources, Stores & Volumes

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--resources` | `MEDIOS_RESOURCES` | — | Total consumable resources per node. Can be provided in JSON format or as a semicolon-delimited list of key:value pairs, with the role optionally specified. |
| `--stores` | `MEDIOS_STORES` | — | Path to a JSON stores declaration file (`file:///...` or `/path/...`) declaring host directories exposed as shared `store/<name>` resources with `class`, `locality`, `readers`, and `writers`. |
| `--default_role` | `MEDIOS_DEFAULT_ROLE` | `*` | Any resources in the `--resources` flag that omit a role, as well as any resources that are not present in `--resources` but that are automatically detected, will be assigned to this role. |
| `--attributes` | `MEDIOS_ATTRIBUTES` | — | Attributes of the node machine, in the form: `rack:2` or `rack:2;u:1` |
| `--resource_provider_config_dir` | `MEDIOS_RESOURCE_PROVIDER_CONFIG_DIR` | — | Path to a directory that contains local resource provider configs. Each file in the config dir should contain a JSON object representing a `ResourceProviderInfo` object. Each local resource provider provides resources that are local to the node. |
| `--volume_gid_range` | `MEDIOS_VOLUME_GID_RANGE` | — | When this flag is specified, if a task running as non-root user uses a shared persistent volume or a PARENT type SANDBOX_PATH volume, the volume will be owned by a gid allocated from this range and have the `setgid` bit set, and the task process will be launched with the gid as its supplementary group to make sure it can access the volume. (Example: `[10000-20000]`) |
| `--container_disk_watch_interval` | `MEDIOS_CONTAINER_DISK_WATCH_INTERVAL` | `15secs` | The interval between disk quota checks for containers. This flag is used by the `disk/du` isolator. |
| `--enforce_container_disk_quota` | `MEDIOS_ENFORCE_CONTAINER_DISK_QUOTA` | `false` | Whether to enable disk quota enforcement for containers. This flag is used by the `disk/du` isolator. |
| `--revocable_cpu_low_priority` | `MEDIOS_REVOCABLE_CPU_LOW_PRIORITY` | `true` | Run containers with revocable CPU at a lower priority than normal containers (non-revocable cpu). Currently only supported by the cgroups/cpu isolator. |
| `--resource_estimator` | `MEDIOS_RESOURCE_ESTIMATOR` | — | The name of the resource estimator to use for oversubscription. |
| `--qos_controller` | `MEDIOS_QOS_CONTROLLER` | — | The name of the QoS Controller to use for oversubscription. |
| `--qos_correction_interval_min` | `MEDIOS_QOS_CORRECTION_INTERVAL_MIN` | `0secs` | The node polls and carries out QoS corrections from the QoS Controller based on its observed performance of running tasks. The smallest interval between these corrections is controlled by this flag. |
| `--oversubscribed_resources_interval` | `MEDIOS_OVERSUBSCRIBED_RESOURCES_INTERVAL` | `15secs` | The node periodically updates the controller with the current estimation about the total amount of oversubscribed resources that are allocated and available. The interval between updates is controlled by this flag. |

## Executors, Recovery & Garbage Collection

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--work_dir` | `MEDIOS_WORK_DIR` | — | Path of the node work directory. This is where executor sandboxes will be placed, as well as the node's checkpointed state in case of failover. |
| `--runtime_dir` | `MEDIOS_RUNTIME_DIR` | `/var/run/medios` (fallback `/tmp/medios/runtime`) | Path of the node runtime directory. This is where runtime data is stored by a node that it needs to persist across crashes (but not across reboots). This directory will be cleared on reboot. (Example: `/var/run/medios`) |
| `--recover` | `MEDIOS_RECOVER` | `reconnect` | Whether to recover status updates and reconnect with old executors. Valid values for `recover` are reconnect: Reconnect with any old live executors. cleanup: Kill any old live executors and exit. Use this option when doing an incompatible node or executor upgrade. |
| `--recovery_timeout` | `MEDIOS_RECOVERY_TIMEOUT` | `15mins` | Amount of time allotted for the node to recover. If the node takes longer than recovery_timeout to recover, any executors that are waiting to reconnect to the node will self-terminate. The best value of this flag depends on the frameworks being run. |
| `--reconfiguration_policy` | `MEDIOS_RECONFIGURATION_POLICY` | `equal` | This flag controls which node configuration changes are considered acceptable when recovering the previous node state. |
| `--strict` | `MEDIOS_STRICT` | `true` | If `true`, any recovery error at node startup is fatal. If `false`, recovery errors are ignored and as much state as possible is recovered. |
| `--http_command_executor` | `MEDIOS_HTTP_COMMAND_EXECUTOR` | `false` | The underlying executor library to be used for the command executor. If set to `true`, the command executor would use the HTTP based executor library to interact with the Medios node. If set to `false`, the driver based implementation would be used. |
| `--http_executor_domain_sockets` | `MEDIOS_HTTP_EXECUTOR_DOMAIN_SOCKETS` | `false` | Serve the node executor API over a local UNIX domain socket (`node.sock`) instead of TCP. |
| `--domain_socket_location` | `MEDIOS_DOMAIN_SOCKET_LOCATION` | — | Filesystem path for the executor UNIX domain socket (must be shorter than 108 characters). |
| `--http_heartbeat_interval` | `MEDIOS_HTTP_HEARTBEAT_INTERVAL` | `30secs` | This flag sets a heartbeat interval (e.g. '5secs', '10mins') for messages to be sent over persistent connections made against the node HTTP API. Currently, this only applies to the 'LAUNCH_NESTED_CONTAINER_SESSION' and 'ATTACH_CONTAINER_OUTPUT' calls. |
| `--executor_environment_variables` | `MEDIOS_EXECUTOR_ENVIRONMENT_VARIABLES` | — | JSON object representing the environment variables that should be passed to the executor, and thus subsequently task(s). By default this flag is none. Users have to define executor environment explicitly. |
| `--executor_registration_timeout` | `MEDIOS_EXECUTOR_REGISTRATION_TIMEOUT` | `1mins` | Amount of time to wait for an executor to register with the node before considering it hung and shutting it down (e.g., 60secs, 3mins, etc) |
| `--executor_reregistration_timeout` | `MEDIOS_EXECUTOR_REREGISTRATION_TIMEOUT` | `2secs` | The timeout within which an executor is expected to reregister after the node has restarted, before the node considers it gone and shuts it down. Note that currently, the node will not reregister with the controller until this timeout has elapsed. |
| `--executor_reregistration_retry_interval` | `MEDIOS_EXECUTOR_REREGISTRATION_RETRY_INTERVAL` | — | Interval between retry reconnect messages sent to PID-based executors during node recovery. |
| `--executor_shutdown_grace_period` | `MEDIOS_EXECUTOR_SHUTDOWN_GRACE_PERIOD` | `5secs` | Default grace period an executor is given to shut down cleanly before forcible termination (overridden by `ExecutorInfo.shutdown_grace_period`). |
| `--registration_backoff_factor` | `MEDIOS_REGISTRATION_BACKOFF_FACTOR` | `1secs` | Node initially picks a random amount of time between `[0, b]`, where `b = registration_backoff_factor`, to (re-)register with a new controller. |
| `--max_completed_executors_per_framework` | `MEDIOS_MAX_COMPLETED_EXECUTORS_PER_FRAMEWORK` | `150` | Maximum number of completed executors per framework to store in memory. |
| `--gc_delay` | `MEDIOS_GC_DELAY` | `1weeks` | Maximum amount of time to wait before cleaning up executor directories (e.g., 3days, 2weeks, etc). Note that this delay may be shorter depending on the available disk usage. |
| `--gc_disk_headroom` | `MEDIOS_GC_DISK_HEADROOM` | `0.1` | Fraction of disk capacity reserved as free headroom by sandbox garbage collection (`0.1` = 10%). |
| `--gc_non_executor_container_sandboxes` | `MEDIOS_GC_NON_EXECUTOR_CONTAINER_SANDBOXES` | `false` | Determines whether nested container sandboxes created via the LAUNCH_CONTAINER and LAUNCH_NESTED_CONTAINER APIs will be automatically garbage collected by the node upon termination. The REMOVE_(NESTED_)CONTAINER API is unaffected by this flag and can still be used. |
| `--disk_watch_interval` | `MEDIOS_DISK_WATCH_INTERVAL` | `1mins` | Periodic time interval (e.g., 10secs, 2mins, etc) to check the overall disk usage managed by the node. This drives the garbage collection of archived information and sandboxes. |
| `--container_logger` | `MEDIOS_CONTAINER_LOGGER` | — | Container logger module name handling container `stdout`/`stderr`. The default logger writes `stdout` and `stderr` files directly in the task sandbox. |

## Fetcher & URIs

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--fetcher_stall_timeout` | `MEDIOS_FETCHER_STALL_TIMEOUT` | `1mins` | Amount of time for image/provisioning downloads to wait before considering a download too slow and aborting it when the download stalls (i.e., the speed keeps below one byte per second). |
| `--fetcher_allow_local_uris` | `MEDIOS_FETCHER_ALLOW_LOCAL_URIS` | `true` | Allow `file://` and local host path URIs in `CommandInfo.uris`. Set to `false` on hardened multi-host nodes. |
| `--fetcher_allowed_local_uri_prefix` | `MEDIOS_FETCHER_ALLOWED_LOCAL_URI_PREFIX` | — | When local URIs are enabled, restrict `file://` fetches to canonical paths beneath this host directory prefix. |

## Authentication, Authorization & Secrets

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--authenticatee` | `MEDIOS_AUTHENTICATEE` | `identity_assertion` | Authenticatee implementation used when authenticating with the controller (`identity_assertion` by default). |
| `--credential` | `MEDIOS_CREDENTIAL` | — | Path to a JSON-formatted file containing the credential to use to authenticate with the controller. Path could be of the form `file:///path/to/file` or `/path/to/file`. |
| `--authentication_backoff_factor` | `MEDIOS_AUTHENTICATION_BACKOFF_FACTOR` | `1secs` | The node will time out its authentication with the controller based on exponential backoff. The timeout will be randomly chosen within the range `[min, min + factor*2^n]` where `n` is the number of failed attempts. |
| `--authentication_timeout_min` | `MEDIOS_AUTHENTICATION_TIMEOUT_MIN` | `5secs` | The minimum amount of time the node waits before retrying authenticating with the controller. See `authentication_backoff_factor` for more details. |
| `--authentication_timeout_max` | `MEDIOS_AUTHENTICATION_TIMEOUT_MAX` | `1mins` | The maximum amount of time the node waits before retrying authenticating with the controller. See `authentication_backoff_factor` for more details. |
| `--http_authenticators` | `MEDIOS_HTTP_AUTHENTICATORS` | — | HTTP authenticator implementation to use when handling requests to authenticated endpoints. Use the default `basic`, or load an alternate HTTP authenticator module using `--modules`. |
| `--authenticate_http_readwrite` | `MEDIOS_AUTHENTICATE_HTTP_READWRITE` | `false` | If `true`, only authenticated requests for read-write HTTP endpoints supporting authentication are allowed. If `false`, unauthenticated requests to such HTTP endpoints are also allowed. |
| `--authenticate_http_readonly` | `MEDIOS_AUTHENTICATE_HTTP_READONLY` | `false` | If `true`, only authenticated requests for read-only HTTP endpoints supporting authentication are allowed. If `false`, unauthenticated requests to such HTTP endpoints are also allowed. |
| `--authenticate_http_executors` | `MEDIOS_AUTHENTICATE_HTTP_EXECUTORS` | `false` | If `true`, only authenticated requests for the HTTP executor API are allowed. If `false`, unauthenticated requests are also allowed. This flag is only available when Medios is built with SSL support. |
| `--http_credentials` | `MEDIOS_HTTP_CREDENTIALS` | — | Path to a JSON-formatted file containing credentials used to authenticate HTTP endpoints on the node. Path can be of the form `file:///path/to/file` or `/path/to/file`. |
| `--jwt_secret_key` | `MEDIOS_JWT_SECRET_KEY` | — | Path to a file containing the key used when generating JWT secrets. This flag is only available when Medios is built with SSL support. |
| `--authorizer` | `MEDIOS_AUTHORIZER` | `local` | Authorizer implementation used on the node (`local` by default, or a custom module loaded via `--modules`). |
| `--acls` | `MEDIOS_ACLS` | — | The value could be a JSON-formatted string of ACLs or a file path containing the JSON-formatted ACLs used for authorization. Path could be of the form `file:///path/to/file` or `/path/to/file`. |
| `--secret_resolver` | `MEDIOS_SECRET_RESOLVER` | — | The name of the secret resolver module to use for resolving environment and file-based secrets. If this flag is not specified, the default behavior is to resolve value-based secrets and error on reference-based secrets. |

## Modules, Hooks & Diagnostics

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--modules` | `MEDIOS_MODULES` | — | List of modules to be loaded and be available to the internal subsystems. Use `--modules=filepath` to specify the list of modules via a file containing a JSON-formatted string. `filepath` can be of the form `file:///path/to/file` or `/path/to/file`. |
| `--modules_dir` | `MEDIOS_MODULES_DIR` | — | Directory path of the module manifest files. The manifest files are processed in alphabetical order. (See --modules for more information on module manifest files). Cannot be used in conjunction with --modules. |
| `--hooks` | `MEDIOS_HOOKS` | — | A comma-separated list of hook modules to be installed inside the node. |
| `--node_features` | `MEDIOS_NODE_FEATURES` | — | JSON representation of node features to allowlist. We always require 'MULTI_ROLE', 'HIERARCHICAL_ROLE', 'RESERVATION_REFINEMENT', 'NODE_OPERATION_FEEDBACK', 'RESOURCE_PROVIDER', 'NODE_DRAINING', and 'TASK_RESOURCE_LIMITS'. |
| `--perf_events` | `MEDIOS_PERF_EVENTS` | — | Comma-separated `perf` event names sampled per container when the `perf_event` isolator is enabled (for example `cycles,task-clock`). |
| `--perf_interval` | `MEDIOS_PERF_INTERVAL` | `60secs` | Interval between the start of perf stat samples. Perf samples are obtained periodically according to `perf_interval` and the most recently obtained sample is returned rather than sampling on demand. |
| `--perf_duration` | `MEDIOS_PERF_DURATION` | `10secs` | Duration of a perf stat sample. The duration must be less than the `perf_interval`. |
| `--memory_profiling` | `MEDIOS_MEMORY_PROFILING` | `false` | This setting controls whether the memory profiling functionality of libprocess should be exposed when jemalloc is detected. |
| `--version` | `MEDIOS_VERSION` | `false` | Show version and exit. |
