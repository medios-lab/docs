#!/usr/bin/env node
/**
 * Generate K3s-style 4-column CLI flag tables from medios C++ flag sources.
 * Usage:
 *   node scripts/gen-cli-reference.mjs --medios-dir ../medios [--git-ref origin/master] [--out-dir .]
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const ROOT = path.resolve(import.meta.dirname, '..');
const mediosDir = path.resolve(ROOT, getArg('--medios-dir', '../medios'));
const gitRef = getArg('--git-ref', '');
const outDir = path.resolve(ROOT, getArg('--out-dir', '.'));

function readSource(relPath) {
  if (gitRef) {
    return execFileSync('git', ['show', `${gitRef}:${relPath}`], {
      cwd: mediosDir,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
  }
  const fullSrc = path.join(mediosDir, relPath);
  if (!fs.existsSync(fullSrc)) {
    console.error(`Missing ${fullSrc}`);
    process.exit(1);
  }
  return fs.readFileSync(fullSrc, 'utf8');
}

// Verified C++ constant values from src/controller/constants.hpp,
// src/node/constants.hpp, src/common/http.hpp, include/medios/allocator/allocator.hpp,
// and include/medios/medios.proto.
const CONSTANTS = {
  MIN_CPUS: '0.01',
  MIN_MEM: '32MB',
  DEFAULT_AUTHENTICATION_V0_TIMEOUT: '15secs',
  DEFAULT_HEARTBEAT_INTERVAL: '15secs',
  DEFAULT_NODE_PING_TIMEOUT: '15secs',
  DEFAULT_MAX_NODE_PING_TIMEOUTS: '5',
  MIN_NODE_REREGISTER_TIMEOUT: '10mins',
  RECOVERY_NODE_REMOVAL_PERCENT_LIMIT: '1.0',
  DEFAULT_MAX_OPERATOR_EVENT_STREAM_SUBSCRIBERS: '1000',
  DEFAULT_MAX_COMPLETED_FRAMEWORKS: '50',
  DEFAULT_MAX_COMPLETED_TASKS_PER_FRAMEWORK: '1000',
  DEFAULT_MAX_UNREACHABLE_TASKS_PER_FRAMEWORK: '1000',
  DEFAULT_REGISTRY_GC_INTERVAL: '15mins',
  DEFAULT_REGISTRY_MAX_NODE_AGE: '2weeks',
  DEFAULT_REGISTRY_MAX_NODE_COUNT: '102400',
  DEFAULT_AUTHENTICATOR: 'identity_assertion',
  DEFAULT_ALLOCATOR: 'hierarchical',
  DEFAULT_ALLOCATION_INTERVAL: '1secs',
  DEFAULT_AUTHORIZER: 'local',
  DEFAULT_BASIC_HTTP_AUTHENTICATOR: 'basic',
  DEFAULT_OFFER_CONSTRAINTS_RE2_MAX_MEM: '4096B',
  DEFAULT_OFFER_CONSTRAINTS_RE2_MAX_PROGRAM_SIZE: '100',
  'medios::allocator::DEFAULT_ALLOCATOR_NODE_RECOVERY_FACTOR': '0.8',
  'medios::allocator::DEFAULT_ALLOCATOR_RECOVERY_TIMEOUT': '10mins',
  EXECUTOR_REGISTRATION_TIMEOUT: '1mins',
  EXECUTOR_REREGISTRATION_TIMEOUT: '2secs',
  MAX_EXECUTOR_REREGISTRATION_TIMEOUT: '15secs',
  DEFAULT_EXECUTOR_SHUTDOWN_GRACE_PERIOD: '5secs',
  RECOVERY_TIMEOUT: '15mins',
  DEFAULT_REGISTRATION_BACKOFF_FACTOR: '1secs',
  DEFAULT_AUTHENTICATION_BACKOFF_FACTOR: '1secs',
  DEFAULT_AUTHENTICATION_TIMEOUT_MIN: '5secs',
  DEFAULT_AUTHENTICATION_TIMEOUT_MAX: '1mins',
  GC_DELAY: '1weeks',
  DISK_WATCH_INTERVAL: '1mins',
  GC_DISK_HEADROOM: '0.1',
  DEFAULT_MAX_COMPLETED_EXECUTORS_PER_FRAMEWORK: '150',
  DEFAULT_AUTHENTICATEE: 'identity_assertion',
  DEFAULT_FETCHER_STALL_TIMEOUT: '1mins',
  PKGLIBEXECDIR: '<install-prefix>/libexec/medios',
  DEFAULT_PORTS: '[31000-32000]',
  DEFAULT_CPUS: '1',
  DEFAULT_MEM: '1GB',
  DEFAULT_DISK: '10GB',
};

const FLAG_DEFAULT_OVERRIDES = {
  controller: {
    port: '`5050`',
    recovery_node_removal_limit: '`100%`',
    min_allocatable_resources: '`cpus:0.01\\|mem:32`',
  },
  node: {
    port: '`5051`',
    launcher: '`linux` (Linux) / `posix` (macOS)',
    docker_store_dir: '`/tmp/medios/store/docker`',
    runtime_dir: '`/var/run/medios` (fallback `/tmp/medios/runtime`)',
    launcher_dir: '`<install-prefix>/libexec/medios`',
  },
  execute: {},
};

// Explicit overrides where upstream C++ flag help text is stale, misleading,
// or contains raw C++ interpolations that do not read cleanly in docs.
const FLAG_DESC_OVERRIDES = {
  controller: {
    registry: 'Persistence backend for controller registry state: `in_memory` (default, ephemeral) or `leveldb` (local LevelDB persistence under `--work_dir`).',
    etcd: 'etcd v3 leader election URL (for example `etcd://<host>:2379/<prefix>`) for controller high availability.',
    filter_gpu_resources: 'Cluster policy, off by default (`false`). When `true`, offers from nodes with a `gpus` resource go only to frameworks that declare the `GPU_RESOURCES` capability; when `false`, every framework may receive them.',
    filter_shared_resources: 'Cluster policy, off by default (`false`). When `true`, shared resources (such as `store/<name>` dataset stores) go only to frameworks that declare the `SHARED_RESOURCES` capability; when `false`, every framework may receive them.',
    authenticators: 'Authenticator implementation to use for framework and node authentication. Defaults to `identity_assertion` (self-asserted principal); load a custom module via `--modules` for cryptographic v0 auth.',
    authorizers: 'Authorizer implementation to use for ACL enforcement (`local` by default, or a custom module loaded via `--modules`).',
    http_authenticators: 'HTTP authenticator implementation(s) for read-only and read-write operator endpoints (`basic`, `trusted_header`, or a custom module).',
    http_framework_authenticators: 'HTTP authenticator implementation(s) for `/api/v1/scheduler` (`basic`, `trusted_header`, or a custom module).',
    allocator: 'Allocator implementation to use for resource offers (`hierarchical` by default, or a custom allocator module loaded via `--modules`).',
    min_allocatable_resources: 'Minimum resource quantity sets required before the allocator emits an offer (for example `cpus:0.01|mem:32`).',
    recovery_node_removal_limit: 'Maximum percentage of nodes from the registry allowed to be removed after failover without reregistering (`100%` by default).',
    allowlist: 'Path to a file listing node hostnames allowed to offer resources (`*` offers from all nodes when unset).',
    fair_sharing_excluded_resource_names: 'Comma-separated list of resource names (for example `gpus`) excluded from DRF fair-sharing calculations.',
    rate_limits: 'JSON string or file path (`file:///...` or `/path/...`) configuring per-principal framework API rate limits.',
    offer_constraints_re2_max_mem: 'Maximum memory budget per compiled RE2 regular expression in framework offer constraints.',
    offer_constraints_re2_max_program_size: 'Maximum compiled RE2 program size in framework offer constraints.',
  },
  node: {
    containerizers: 'Single containerizer backend for this node: either `medios` (default) or `docker_shell`. Passing multiple comma-separated containerizers is rejected at startup.',
    launcher: 'Task launcher used by the `medios` containerizer: `linux` (clone namespaces/cgroups, default on Linux when available) or `posix` (default on macOS).',
    launcher_dir: 'Directory containing Medios helper binaries (`medios-executor`, `medios-default-executor`, `medios-docker-executor`, `medios-fetcher`, `medios-containerizer`). Required for command and Docker tasks.',
    stores: 'Path to a JSON stores declaration file (`file:///...` or `/path/...`) declaring host directories exposed as shared `store/<name>` resources with `class`, `locality`, `readers`, and `writers`.',
    isolation: 'Comma-separated list of isolators enabled by the `medios` containerizer (for example `cgroups/cpu,cgroups/mem,filesystem/linux,com_medioslab_medios_gpu`).',
    authenticatee: 'Authenticatee implementation used when authenticating with the controller (`identity_assertion` by default).',
    authorizer: 'Authorizer implementation used on the node (`local` by default, or a custom module loaded via `--modules`).',
    docker_registry: 'Default OCI/Docker registry URL (or local image archive directory) used by the `medios` containerizer to pull Docker images.',
    docker_config: 'Default Docker registry auth config file path or JSON string used when pulling private images.',
    cgroups_net_cls_secondary_handles: 'Range of the form `0xAAAA,0xBBBB` specifying valid secondary handles paired with `--cgroups_net_cls_primary_handle`.',
    strict: 'If `true`, any recovery error at node startup is fatal. If `false`, recovery errors are ignored and as much state as possible is recovered.',
    executor_reregistration_retry_interval: 'Interval between retry reconnect messages sent to PID-based executors during node recovery.',
    executor_shutdown_grace_period: 'Default grace period an executor is given to shut down cleanly before forcible termination (overridden by `ExecutorInfo.shutdown_grace_period`).',
    container_logger: 'Container logger module name handling container `stdout`/`stderr`. The default logger writes `stdout` and `stderr` files directly in the task sandbox.',
    perf_events: 'Comma-separated `perf` event names sampled per container when the `perf_event` isolator is enabled (for example `cycles,task-clock`).',
    seccomp_config_dir: 'Directory containing Docker/Moby-compatible Seccomp JSON profiles. Required whenever `linux/seccomp` is enabled in `--isolation`.',
    seccomp_profile_name: 'Default Seccomp profile filename relative to `--seccomp_config_dir`, applied to every Medios container unless overridden per task.',
    fetcher_allow_local_uris: 'Allow `file://` and local host path URIs in `CommandInfo.uris`. Set to `false` on hardened multi-host nodes.',
    fetcher_allowed_local_uri_prefix: 'When local URIs are enabled, restrict `file://` fetches to canonical paths beneath this host directory prefix.',
    http_executor_domain_sockets: 'Serve the node executor API over a local UNIX domain socket (`node.sock`) instead of TCP.',
    domain_socket_location: 'Filesystem path for the executor UNIX domain socket (must be shorter than 108 characters).',
    cgroups_hierarchy: 'Base path to the Linux cgroups hierarchy (used for cgroups v1 and v2).',
    gc_disk_headroom: 'Fraction of disk capacity reserved as free headroom by sandbox garbage collection (`0.1` = 10%).',
  },
  execute: {
    task: 'JSON string or file path (`file:///...` or `/path/...`) containing a full `TaskInfo` message (`node_id` is filled automatically from the accepted offer).',
    task_group: 'JSON string or file path (`file:///...` or `/path/...`) containing a `TaskGroupInfo` message (`node_id` is filled automatically from the accepted offer).',
    constraints: 'Semicolon-delimited exact-match node attribute constraints (for example `os:linux;rack:r1`). Offers must match every constraint to be accepted.',
    rlimits: 'JSON representation of POSIX `RLimitInfo` limits applied to the task command before `exec`.',
  },
};

const CONTROLLER_GROUPS = [
  {
    title: 'Network & Binding',
    flags: [
      'ip', 'port', 'advertise_ip', 'advertise_port', 'hostname', 'hostname_lookup',
      'ip_discovery_command', 'domain', 'require_node_domain', 'firewall_rules',
    ],
  },
  {
    title: 'Registry, Persistence & Failover',
    flags: [
      'work_dir', 'registry', 'registry_strict', 'registry_fetch_timeout',
      'registry_store_timeout', 'registry_gc_interval', 'registry_max_node_age',
      'registry_max_node_count', 'etcd', 'controller_contender', 'controller_detector',
      'node_reregister_timeout', 'recovery_node_removal_limit', 'node_removal_rate_limit',
      'node_ping_timeout', 'max_node_ping_timeouts',
    ],
  },
  {
    title: 'Allocation, Offers & Roles',
    flags: [
      'allocator', 'allocation_interval', 'allocator_node_recovery_factor',
      'allocator_recovery_timeout', 'roles', 'weights', 'role_sorter',
      'framework_sorter', 'fair_sharing_excluded_resource_names',
      'filter_gpu_resources', 'filter_shared_resources', 'min_allocatable_resources',
      'offer_timeout', 'allowlist', 'offer_constraints_re2_max_mem',
      'offer_constraints_re2_max_program_size',
    ],
  },
  {
    title: 'Authentication, Authorization & Rate Limits',
    flags: [
      'authenticate_frameworks', 'authenticate_nodes', 'authentication_v0_timeout',
      'authenticate_http_readwrite', 'authenticate_http_readonly',
      'authenticate_http_frameworks', 'authenticators', 'http_authenticators',
      'http_framework_authenticators', 'credentials', 'authorizers', 'acls',
      'root_submissions', 'rate_limits',
    ],
  },
  {
    title: 'Modules, Hooks, Limits & Diagnostics',
    flags: [
      'cluster', 'modules', 'modules_dir', 'hooks', 'max_executors_per_node',
      'max_operator_event_stream_subscribers', 'max_completed_frameworks',
      'max_completed_tasks_per_framework', 'max_unreachable_tasks_per_framework',
      'publish_per_framework_metrics', 'memory_profiling', 'version',
    ],
  },
];

const NODE_GROUPS = [
  {
    title: 'Network & Binding',
    flags: [
      'controller', 'controller_detector', 'ip', 'ip6', 'port', 'advertise_ip',
      'advertise_port', 'hostname', 'hostname_lookup', 'ip_discovery_command',
      'ip6_discovery_command', 'domain', 'firewall_rules',
    ],
  },
  {
    title: 'Containerizer, Isolation & Linux Security',
    flags: [
      'containerizers', 'launcher', 'launcher_dir', 'isolation', 'switch_user',
      'sandbox_directory', 'default_container_info', 'image_providers',
      'image_provisioner_backend', 'image_gc_config', 'docker_registry',
      'docker_store_dir', 'docker_ignore_runtime', 'docker_config',
      'cgroups_destroy_timeout', 'cgroups_hierarchy', 'cgroups_root',
      'cgroups_enable_cfs', 'cgroups_limit_swap', 'cgroups_cpu_enable_pids_and_tids_count',
      'cgroups_net_cls_primary_handle', 'cgroups_net_cls_secondary_handles',
      'allowed_devices', 'node_subsystems', 'effective_capabilities',
      'bounding_capabilities', 'seccomp_config_dir', 'seccomp_profile_name',
      'default_container_shm_size', 'disallow_sharing_node_ipc_namespace',
      'disallow_sharing_node_pid_namespace', 'systemd_enable_support',
      'systemd_runtime_directory',
    ],
  },
  {
    title: 'Resources, Stores & Volumes',
    flags: [
      'resources', 'stores', 'default_role', 'attributes',
      'resource_provider_config_dir', 'volume_gid_range',
      'container_disk_watch_interval', 'enforce_container_disk_quota',
      'revocable_cpu_low_priority', 'resource_estimator', 'qos_controller',
      'qos_correction_interval_min', 'oversubscribed_resources_interval',
    ],
  },
  {
    title: 'Executors, Recovery & Garbage Collection',
    flags: [
      'work_dir', 'runtime_dir', 'recover', 'recovery_timeout',
      'reconfiguration_policy', 'strict', 'http_command_executor',
      'http_executor_domain_sockets', 'domain_socket_location',
      'http_heartbeat_interval', 'executor_environment_variables',
      'executor_registration_timeout', 'executor_reregistration_timeout',
      'executor_reregistration_retry_interval', 'executor_shutdown_grace_period',
      'registration_backoff_factor', 'max_completed_executors_per_framework',
      'gc_delay', 'gc_disk_headroom', 'gc_non_executor_container_sandboxes',
      'disk_watch_interval', 'container_logger',
    ],
  },
  {
    title: 'Fetcher & URIs',
    flags: [
      'fetcher_stall_timeout', 'fetcher_allow_local_uris',
      'fetcher_allowed_local_uri_prefix',
    ],
  },
  {
    title: 'Authentication, Authorization & Secrets',
    flags: [
      'authenticatee', 'credential', 'authentication_backoff_factor',
      'authentication_timeout_min', 'authentication_timeout_max',
      'http_authenticators', 'authenticate_http_readwrite',
      'authenticate_http_readonly', 'authenticate_http_executors',
      'http_credentials', 'jwt_secret_key', 'authorizer', 'acls',
      'secret_resolver',
    ],
  },
  {
    title: 'Modules, Hooks & Diagnostics',
    flags: [
      'modules', 'modules_dir', 'hooks', 'node_features', 'perf_events',
      'perf_interval', 'perf_duration', 'memory_profiling', 'version',
    ],
  },
];

function resolveDefault(rawDef, targetKey, flagName) {
  if (FLAG_DEFAULT_OVERRIDES[targetKey] && FLAG_DEFAULT_OVERRIDES[targetKey][flagName]) {
    return FLAG_DEFAULT_OVERRIDES[targetKey][flagName];
  }
  if (!rawDef) return '—';
  const trimmed = rawDef.trim();
  if (!trimmed || trimmed.startsWith('[') || trimmed.includes('->') || trimmed.includes('validate') || trimmed.startsWith('#')) {
    return '—';
  }
  if (CONSTANTS[trimmed] !== undefined) {
    return '`' + CONSTANTS[trimmed].replace(/\|/g, '\\|') + '`';
  }
  const dur = trimmed.match(/^(Seconds|Minutes|Hours|Days|Weeks|Milliseconds)\((\d+(?:\.\d+)?)\)$/);
  if (dur) {
    const unitMap = {
      Milliseconds: 'ms',
      Seconds: 'secs',
      Minutes: 'mins',
      Hours: 'hrs',
      Days: 'days',
      Weeks: 'weeks',
    };
    return '`' + dur[2] + unitMap[dur[1]] + '`';
  }
  const bytes = trimmed.match(/^(Bytes|Kilobytes|Megabytes|Gigabytes)\((\d+(?:\.\d+)?)\)$/);
  if (bytes) {
    const unitMap = { Bytes: 'B', Kilobytes: 'KB', Megabytes: 'MB', Gigabytes: 'GB' };
    return '`' + bytes[2] + unitMap[bytes[1]] + '`';
  }
  const str = trimmed.match(/^"([^"]*)"$/);
  if (str) {
    return '`' + str[1].replace(/\|/g, '\\|') + '`';
  }
  if (/^(true|false|-?\d+(?:\.\d+)?)$/.test(trimmed)) {
    return '`' + trimmed + '`';
  }
  return '—';
}

// Reconstruct a C++ string expression that concatenates string literals with
// string(CONST) / stringify(CONST) / CONST references.
function extractHelpText(expr) {
  if (!expr) return '';
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === '"') {
      i++;
      let s = '';
      while (i < expr.length && expr[i] !== '"') {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          const nxt = expr[++i];
          if (nxt === 'n') s += ' ';
          else if (nxt === 't') s += ' ';
          else if (nxt === '"') s += '"';
          else if (nxt === '\\') s += '\\';
          else s += nxt;
          i++;
        } else {
          s += expr[i++];
        }
      }
      i++; // closing quote
      tokens.push(s);
    } else if (expr.slice(i).startsWith('string(') || expr.slice(i).startsWith('stringify(')) {
      const open = expr.indexOf('(', i);
      let d = 1;
      let j = open + 1;
      while (j < expr.length && d > 0) {
        if (expr[j] === '(') d++;
        else if (expr[j] === ')') d--;
        j++;
      }
      const inner = expr.slice(open + 1, j - 1).trim();
      if (CONSTANTS[inner] !== undefined) {
        tokens.push(CONSTANTS[inner]);
      }
      i = j;
    } else {
      // Bare constant identifier after '+'
      const idMatch = expr.slice(i).match(/^([A-Z][A-Z0-9_]{3,})/);
      if (idMatch && CONSTANTS[idMatch[1]] !== undefined) {
        tokens.push(CONSTANTS[idMatch[1]]);
        i += idMatch[1].length;
      } else {
        i++;
      }
    }
  }
  return tokens.join('');
}

// Escape MDX-unsafe bare characters ONLY outside inline backtick code spans.
function escapeOutsideBackticks(text) {
  const parts = text.split(/(`[^`]*`)/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      // Inside backticks: keep < and > raw, escape pipe for markdown table cells
      return part.replace(/\|/g, '\\|');
    }
    return part
      .replace(/\|/g, '\\|')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}');
  }).join('');
}

function cleanDescription(rawExpr, targetKey, flagName) {
  if (FLAG_DESC_OVERRIDES[targetKey] && FLAG_DESC_OVERRIDES[targetKey][flagName]) {
    return escapeOutsideBackticks(FLAG_DESC_OVERRIDES[targetKey][flagName]);
  }

  let desc = extractHelpText(rawExpr)
    // Strip internal IDs & issue references cleanly, including empty parens left behind
    .replace(/\((?:[^()]*\b(?:DR|FAC3|BUILD|MESOS)-\d+[^()]*)\)/g, '')
    .replace(/\b(?:DR|FAC3|BUILD|MESOS)-\d+\b/g, '')
    .replace(/\bApache Mesos\b/g, 'Medios')
    .replace(/\bMesos\b/g, 'Medios')
    .replace(/\bmesos-master\b/g, 'medios-controller')
    .replace(/\bmesos-slave\b/g, 'medios-node')
    .replace(/\bagent_id\b/g, 'node_id')
    .replace(/\s*\(\s*#[0-9]{2,4}\s*\)/g, '')
    .replace(/#[0-9]{2,4}\b/g, '')
    // Remove example JSON blobs and multi-sentence CLI examples after "Example:" or "NOTE:"
    .replace(/\s+Example[s]?:[\s\S]*$/i, '')
    .replace(/\s+e\.g\.,?\s*\{[\s\S]*$/i, '')
    .replace(/\s+See\s+https?:\/\/\S+\.?/gi, '')
    .replace(/https?:\/\/issues\.apache\.org\S+/gi, '')
    .replace(/https?:\/\/www\.mail-archive\.com\S+/gi, '')
    // Clean empty backticks and dangling punctuation/parens
    .replace(/``/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // Keep complete sentences up to 280 chars without splitting on abbreviations (e.g., i.e., v1.2, *.proto)
  if (desc.length > 280) {
    const sentences = desc.split(/(?<=[.?!])\s+(?=[A-Z`'])/);
    if (sentences.length > 1) {
      let acc = '';
      for (const s of sentences) {
        const candidate = acc ? `${acc} ${s}` : s;
        if (candidate.length <= 280) {
          acc = candidate;
        } else {
          break;
        }
      }
      desc = (acc.length >= 40 ? acc : sentences[0]).trim();
    }
  }

  // Ensure balanced backticks before escaping
  const tickCount = (desc.match(/`/g) || []).length;
  if (tickCount % 2 === 1) {
    desc = desc.replace(/`[^`]*$/, '').trim();
  }

  desc = desc.replace(/\(\s*\)/g, '').replace(/\s+/g, ' ').trim();
  if (!desc) return 'See `--help` output.';

  return escapeOutsideBackticks(desc);
}

function parseFlags(src, targetKey, envPrefix) {
  const out = [];
  const seen = new Set();
  const re = /\badd\s*\(\s*&Flags::([A-Za-z0-9_]+)\s*,/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    let i = re.lastIndex;
    let depth = 1;
    let inStr = false;
    let esc = false;
    while (i < src.length && depth > 0) {
      const ch = src[i++];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
        else if (ch === '(') depth++;
        else if (ch === ')') depth--;
      }
    }
    const blob = src.slice(re.lastIndex, i - 1);
    const parts = [];
    let cur = '';
    let d = 0;
    inStr = false;
    esc = false;
    for (const ch of blob) {
      if (inStr) {
        cur += ch;
        if (esc) esc = false;
        else if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') { inStr = true; cur += ch; }
        else if ('([{'.includes(ch)) { d++; cur += ch; }
        else if (')]}'.includes(ch)) { d--; cur += ch; }
        else if (ch === ',' && d === 0) { parts.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
    }
    if (cur.trim()) parts.push(cur.trim());
    if (parts.length < 2) continue;

    const helpIdx = parts.length >= 3 && parts[1].includes('DeprecatedName') ? 2 : 1;
    const nameMatch = parts[0].match(/"([^"]+)"/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    if (seen.has(name)) continue;
    seen.add(name);

    const desc = cleanDescription(parts[helpIdx] || '', targetKey, name);
    const def = resolveDefault(parts[helpIdx + 1] || '', targetKey, name);

    out.push({
      name,
      flag: '`--' + name + '`',
      env: envPrefix ? '`' + envPrefix + name.toUpperCase() + '`' : '—',
      def,
      desc,
    });
  }
  return out;
}

function renderTable(rows) {
  return [
    '| Flag | Environment variable | Default | Description |',
    '| --- | --- | --- | --- |',
    ...rows.map(f => `| ${f.flag} | ${f.env} | ${f.def} | ${f.desc} |`),
  ].join('\n');
}

function renderGrouped(flags, groups) {
  if (!groups) {
    return renderTable(flags);
  }
  const byName = new Map(flags.map(f => [f.name, f]));
  const placed = new Set();
  const sections = [];

  for (const g of groups) {
    const items = [];
    for (const name of g.flags) {
      if (byName.has(name) && !placed.has(name)) {
        items.push(byName.get(name));
        placed.add(name);
      }
    }
    if (items.length > 0) {
      sections.push(`## ${g.title}\n\n${renderTable(items)}`);
    }
  }

  const remaining = flags.filter(f => !placed.has(f.name));
  if (remaining.length > 0) {
    sections.push(`## General\n\n${renderTable(remaining)}`);
  }

  return sections.join('\n\n');
}

const targets = [
  {
    key: 'controller',
    src: 'src/controller/flags.cpp',
    dst: 'docs/cli/controller.md',
    title: 'medios-controller',
    intro: 'Flags accepted by `medios-controller`, the cluster coordinator daemon. Every flag can also be passed as an environment variable with the `MEDIOS_` prefix.',
    envPrefix: 'MEDIOS_',
    groups: CONTROLLER_GROUPS,
  },
  {
    key: 'node',
    src: 'src/node/flags.cpp',
    dst: 'docs/cli/node.md',
    title: 'medios-node',
    intro: 'Flags accepted by `medios-node`, the machine-side daemon. Every flag can also be passed as an environment variable with the `MEDIOS_` prefix.',
    envPrefix: 'MEDIOS_',
    groups: NODE_GROUPS,
  },
  {
    key: 'execute',
    src: 'src/cli/execute.cpp',
    dst: 'docs/cli/execute.md',
    title: 'medios-execute',
    intro: 'Flags accepted by `medios-execute`, the single-task submission CLI.',
    envPrefix: '',
    groups: null,
  },
];

for (const t of targets) {
  const src = readSource(t.src);
  const flags = parseFlags(src, t.key, t.envPrefix);
  const body = renderGrouped(flags, t.groups);
  const md = `---
title: ${t.title}
doc_type: reference
---

# ${t.title}

${t.intro}

${body}
`;
  const dstPath = path.join(outDir, t.dst);
  fs.mkdirSync(path.dirname(dstPath), { recursive: true });
  fs.writeFileSync(dstPath, md, 'utf8');
  console.log(`Generated ${t.dst} (${flags.length} flags)`);
}
