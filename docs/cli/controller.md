---
title: medios-controller
doc_type: reference
---

# medios-controller

Flags accepted by `medios-controller`, the cluster coordinator daemon. Every flag can also be passed as an environment variable with the `MEDIOS_` prefix.

## Network & Binding

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--ip` | `MEDIOS_IP` | — | IP address to listen on. This cannot be used in conjunction with `--ip_discovery_command`. |
| `--port` | `MEDIOS_PORT` | `5050` | Port to listen on. |
| `--advertise_ip` | `MEDIOS_ADVERTISE_IP` | — | IP address advertised to reach this Medios controller. The controller does not bind using this IP address. However, this IP address may be used to access this controller. |
| `--advertise_port` | `MEDIOS_ADVERTISE_PORT` | — | Port advertised to reach Medios controller (along with `advertise_ip`). The controller does not bind to this port. However, this port (along with `advertise_ip`) may be used to access this controller. |
| `--hostname` | `MEDIOS_HOSTNAME` | — | The hostname the controller should advertise. If left unset, the hostname is resolved from the IP address that the controller advertises; unless the user explicitly prevents that, using `--no-hostname_lookup`, in which case the IP itself is used. |
| `--hostname_lookup` | `MEDIOS_HOSTNAME_LOOKUP` | `true` | Whether we should execute a lookup to find out the server's hostname, if not explicitly set (via, e.g., `--hostname`). True by default; if set to `false` it will cause Medios to use the IP address, unless the hostname is explicitly set. |
| `--ip_discovery_command` | `MEDIOS_IP_DISCOVERY_COMMAND` | — | Optional IP discovery binary: if set, it is expected to emit the IP address which the controller will try to bind to. Cannot be used in conjunction with `--ip`. |
| `--domain` | `MEDIOS_DOMAIN` | — | Domain that the controller belongs to. Medios currently only supports fault domains, which identify groups of hosts with similar failure characteristics. A fault domain consists of a region and a zone. |
| `--require_node_domain` | `MEDIOS_REQUIRE_NODE_DOMAIN` | `false` | If true, only nodes with a configured domain can register. |
| `--firewall_rules` | `MEDIOS_FIREWALL_RULES` | — | The value could be a JSON-formatted string of rules or a file path containing the JSON-formatted rules used in the endpoints firewall. Path must be of the form `file:///path/to/file` or `/path/to/file`. See the `Firewall` message in `flags.proto` for the expected format. |

## Registry, Persistence & Failover

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--work_dir` | `MEDIOS_WORK_DIR` | — | Path of the controller work directory. This is where the persistent information of the cluster will be stored. |
| `--registry` | `MEDIOS_REGISTRY` | `in_memory` | Persistence backend for controller registry state: `in_memory` (default, ephemeral) or `leveldb` (local LevelDB persistence under `--work_dir`). |
| `--registry_strict` | `MEDIOS_REGISTRY_STRICT` | `false` | Whether the controller will take actions based on the persistent information stored in the Registry. NOTE: This flag is *disabled* and will be removed in a future version of Medios. |
| `--registry_fetch_timeout` | `MEDIOS_REGISTRY_FETCH_TIMEOUT` | `60secs` | Duration of time to wait in order to fetch data from the registry after which the operation is considered a failure. |
| `--registry_store_timeout` | `MEDIOS_REGISTRY_STORE_TIMEOUT` | `20secs` | Duration of time to wait in order to store data in the registry after which the operation is considered a failure. |
| `--registry_gc_interval` | `MEDIOS_REGISTRY_GC_INTERVAL` | `15mins` | How often to garbage collect the registry. The current leading controller will periodically discard information from the registry. |
| `--registry_max_node_age` | `MEDIOS_REGISTRY_MAX_NODE_AGE` | `2weeks` | Maximum length of time to store information in the registry about nodes that are not currently connected to the cluster. This information allows frameworks to determine the status of unreachable and gone nodes. |
| `--registry_max_node_count` | `MEDIOS_REGISTRY_MAX_NODE_COUNT` | `102400` | Maximum number of partitioned/gone nodes to store in the registry. This information allows frameworks to determine the status of disconnected nodes. Note that the registry always stores information about all connected nodes. See also the `registry_max_node_age` flag. |
| `--etcd` | `MEDIOS_ETCD` | — | etcd v3 leader election URL (for example `etcd://<host>:2379/<prefix>`) for controller high availability. |
| `--controller_contender` | `MEDIOS_CONTROLLER_CONTENDER` | — | The symbol name of the controller contender to use. This symbol should exist in a module specified through the --modules flag. Must be used in conjunction with --controller_detector. |
| `--controller_detector` | `MEDIOS_CONTROLLER_DETECTOR` | — | The symbol name of the controller detector to use. This symbol should exist in a module specified through the --modules flag. Must be used in conjunction with --controller_contender. |
| `--node_reregister_timeout` | `MEDIOS_NODE_REREGISTER_TIMEOUT` | `10mins` | The timeout within which a node is expected to reregister. Nodes reregister when they become disconnected from the controller or when a new controller is elected as the leader. |
| `--recovery_node_removal_limit` | `MEDIOS_RECOVERY_NODE_REMOVAL_LIMIT` | `100%` | Maximum percentage of nodes from the registry allowed to be removed after failover without reregistering (`100%` by default). |
| `--node_removal_rate_limit` | `MEDIOS_NODE_REMOVAL_RATE_LIMIT` | — | The maximum rate (e.g., `1/10mins`, `2/3hrs`, etc) at which nodes will be removed from the controller when they fail health checks. By default, nodes will be removed as soon as they fail the health checks. The value is of the form `(Number of nodes)/(Duration)`. |
| `--node_ping_timeout` | `MEDIOS_NODE_PING_TIMEOUT` | `15secs` | The timeout within which a node is expected to respond to a ping from the controller. Nodes that do not respond within max_node_ping_timeouts ping retries will be marked unreachable. |
| `--max_node_ping_timeouts` | `MEDIOS_MAX_NODE_PING_TIMEOUTS` | `5` | The number of times a node can fail to respond to a ping from the controller. Nodes that do not respond within `max_node_ping_timeouts` ping retries will be marked unreachable. |

## Allocation, Offers & Roles

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--allocator` | `MEDIOS_ALLOCATOR` | `hierarchical` | Allocator implementation to use for resource offers (`hierarchical` by default, or a custom allocator module loaded via `--modules`). |
| `--allocation_interval` | `MEDIOS_ALLOCATION_INTERVAL` | `1secs` | Amount of time to wait between performing (batch) allocations (e.g., 500ms, 1sec, etc). |
| `--allocator_node_recovery_factor` | `MEDIOS_ALLOCATOR_NODE_RECOVERY_FACTOR` | `0.8` | Minimum fraction of known nodes re-registered after leader election for the allocator to start generating offers. |
| `--allocator_recovery_timeout` | `MEDIOS_ALLOCATOR_RECOVERY_TIMEOUT` | `10mins` | Maximum time to wait before sending offers after a leader re-election. |
| `--roles` | `MEDIOS_ROLES` | — | A comma-separated list of the allocation roles that frameworks in this cluster may belong to. This flag is deprecated; if it is not specified, any role name can be used. |
| `--weights` | `MEDIOS_WEIGHTS` | — | A comma-separated list of role/weight pairs of the form `role=weight,role=weight`. Weights can be used to control the relative share of cluster resources that is offered to different roles. This flag is deprecated. |
| `--role_sorter` | `MEDIOS_ROLE_SORTER` | `drf` | Policy to use for allocating resources between roles when allocating up to quota guarantees as well as when allocating up to quota limits. May be one of: [drf, random] |
| `--framework_sorter` | `MEDIOS_FRAMEWORK_SORTER` | `drf` | Policy to use for allocating resources between a given role's frameworks. Options are the same as for `--user_sorter`. |
| `--fair_sharing_excluded_resource_names` | `MEDIOS_FAIR_SHARING_EXCLUDED_RESOURCE_NAMES` | — | Comma-separated list of resource names (for example `gpus`) excluded from DRF fair-sharing calculations. |
| `--filter_gpu_resources` | `MEDIOS_FILTER_GPU_RESOURCES` | `false` | Cluster policy, off by default (`false`). When `true`, offers from nodes with a `gpus` resource go only to frameworks that declare the `GPU_RESOURCES` capability; when `false`, every framework may receive them. |
| `--filter_shared_resources` | `MEDIOS_FILTER_SHARED_RESOURCES` | `false` | Cluster policy, off by default (`false`). When `true`, shared resources (such as `store/<name>` dataset stores) go only to frameworks that declare the `SHARED_RESOURCES` capability; when `false`, every framework may receive them. |
| `--min_allocatable_resources` | `MEDIOS_MIN_ALLOCATABLE_RESOURCES` | `cpus:0.01\|mem:32` | Minimum resource quantity sets required before the allocator emits an offer (for example `cpus:0.01\|mem:32`). |
| `--offer_timeout` | `MEDIOS_OFFER_TIMEOUT` | — | Duration of time before an offer is rescinded from a framework. This helps fairness when running frameworks that hold on to offers, or frameworks that accidentally drop offers. If not set, offers do not timeout. |
| `--allowlist` | `MEDIOS_ALLOWLIST` | — | Path to a file listing node hostnames allowed to offer resources (`*` offers from all nodes when unset). |
| `--offer_constraints_re2_max_mem` | `MEDIOS_OFFER_CONSTRAINTS_RE2_MAX_MEM` | `4096B` | Maximum memory budget per compiled RE2 regular expression in framework offer constraints. |
| `--offer_constraints_re2_max_program_size` | `MEDIOS_OFFER_CONSTRAINTS_RE2_MAX_PROGRAM_SIZE` | `100` | Maximum compiled RE2 program size in framework offer constraints. |

## Authentication, Authorization & Rate Limits

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--authenticate_frameworks` | `MEDIOS_AUTHENTICATE_FRAMEWORKS` | `false` | If `true`, only authenticated frameworks are allowed to register. If `false`, unauthenticated frameworks are also allowed to register. For HTTP based frameworks use the `--authenticate_http_frameworks` flag. |
| `--authenticate_nodes` | `MEDIOS_AUTHENTICATE_NODES` | `false` | If `true`, only authenticated nodes are allowed to register. If `false`, unauthenticated nodes are also allowed to register. |
| `--authentication_v0_timeout` | `MEDIOS_AUTHENTICATION_V0_TIMEOUT` | `15secs` | The timeout within which an authentication is expected to complete against a v0 framework or node. This does not apply to the v0 or v1 HTTP APIs. |
| `--authenticate_http_readwrite` | `MEDIOS_AUTHENTICATE_HTTP_READWRITE` | `false` | If `true`, only authenticated requests for read-write HTTP endpoints supporting authentication are allowed. If `false`, unauthenticated requests to such HTTP endpoints are also allowed. |
| `--authenticate_http_readonly` | `MEDIOS_AUTHENTICATE_HTTP_READONLY` | `false` | If `true`, only authenticated requests for read-only HTTP endpoints supporting authentication are allowed. If `false`, unauthenticated requests to such HTTP endpoints are also allowed. |
| `--authenticate_http_frameworks` | `MEDIOS_AUTHENTICATE_HTTP_FRAMEWORKS` | `false` | If `true`, only authenticated HTTP frameworks are allowed to register. If `false`, HTTP frameworks are not authenticated. |
| `--authenticators` | `MEDIOS_AUTHENTICATORS` | `identity_assertion` | Authenticator implementation to use for framework and node authentication. Defaults to `identity_assertion` (self-asserted principal); load a custom module via `--modules` for cryptographic v0 auth. |
| `--http_authenticators` | `MEDIOS_HTTP_AUTHENTICATORS` | `basic` | HTTP authenticator implementation(s) for read-only and read-write operator endpoints (`basic`, `trusted_header`, or a custom module). |
| `--http_framework_authenticators` | `MEDIOS_HTTP_FRAMEWORK_AUTHENTICATORS` | — | HTTP authenticator implementation(s) for `/api/v1/scheduler` (`basic`, `trusted_header`, or a custom module). |
| `--credentials` | `MEDIOS_CREDENTIALS` | — | Path to a JSON-formatted file containing credentials. Path could be of the form `file:///path/to/file` or `/path/to/file`. |
| `--authorizers` | `MEDIOS_AUTHORIZERS` | `local` | Authorizer implementation to use for ACL enforcement (`local` by default, or a custom module loaded via `--modules`). |
| `--acls` | `MEDIOS_ACLS` | — | The value could be a JSON-formatted string of ACLs or a file path containing the JSON-formatted ACLs used for authorization. Path could be of the form `file:///path/to/file` or `/path/to/file`. |
| `--root_submissions` | `MEDIOS_ROOT_SUBMISSIONS` | `true` | Can root submit frameworks? |
| `--rate_limits` | `MEDIOS_RATE_LIMITS` | — | JSON string or file path (`file:///...` or `/path/...`) configuring per-principal framework API rate limits. |

## Modules, Hooks, Limits & Diagnostics

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--cluster` | `MEDIOS_CLUSTER` | — | Human readable name for the cluster. |
| `--modules` | `MEDIOS_MODULES` | — | List of modules to be loaded and be available to the internal subsystems. Use `--modules=filepath` to specify the list of modules via a file containing a JSON-formatted string. `filepath` can be of the form `file:///path/to/file` or `/path/to/file`. |
| `--modules_dir` | `MEDIOS_MODULES_DIR` | — | Directory path of the module manifest files. The manifest files are processed in alphabetical order. (See --modules for more information on module manifest files). Cannot be used in conjunction with --modules. |
| `--hooks` | `MEDIOS_HOOKS` | — | A comma-separated list of hook modules to be installed inside controller. |
| `--max_executors_per_node` | `MEDIOS_MAX_EXECUTORS_PER_NODE` | — | Maximum number of executors allowed per node. The network monitoring/isolation technique imposes an implicit resource acquisition on each executor (# ephemeral ports), as a result one can only run a certain number of executors on each node. |
| `--max_operator_event_stream_subscribers` | `MEDIOS_MAX_OPERATOR_EVENT_STREAM_SUBSCRIBERS` | `1000` | Maximum number of simultaneous subscribers to the controller's operator event stream. If new connections bring the total number of subscribers over this value, older connections will be closed by the controller. |
| `--max_completed_frameworks` | `MEDIOS_MAX_COMPLETED_FRAMEWORKS` | `50` | Maximum number of completed frameworks to store in memory. |
| `--max_completed_tasks_per_framework` | `MEDIOS_MAX_COMPLETED_TASKS_PER_FRAMEWORK` | `1000` | Maximum number of completed tasks per framework to store in memory. |
| `--max_unreachable_tasks_per_framework` | `MEDIOS_MAX_UNREACHABLE_TASKS_PER_FRAMEWORK` | `1000` | Maximum number of unreachable tasks per framework to store in memory. |
| `--publish_per_framework_metrics` | `MEDIOS_PUBLISH_PER_FRAMEWORK_METRICS` | `true` | If true, an extensive set of metrics for each active framework will be published. These metrics are useful for understanding cluster behavior, but can be overwhelming for very large numbers of frameworks. |
| `--memory_profiling` | `MEDIOS_MEMORY_PROFILING` | `false` | This setting controls whether the memory profiling functionality of libprocess should be exposed when jemalloc is detected. |
| `--version` | `MEDIOS_VERSION` | `false` | Show version and exit. |
