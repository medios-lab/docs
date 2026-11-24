---
title: medios-execute
doc_type: reference
---

# medios-execute

Flags accepted by `medios-execute`, the single-task submission CLI.

| Flag | Environment variable | Default | Description |
| --- | --- | --- | --- |
| `--controller` | — | — | Medios controller (e.g., IP:PORT). |
| `--task` | — | — | JSON string or file path (`file:///...` or `/path/...`) containing a full `TaskInfo` message (`node_id` is filled automatically from the accepted offer). |
| `--task_group` | — | — | JSON string or file path (`file:///...` or `/path/...`) containing a `TaskGroupInfo` message (`node_id` is filled automatically from the accepted offer). |
| `--name` | — | — | Name for the command. |
| `--shell` | — | `true` | Determine the command is a shell or not. If not, 'command' will be treated as executable value and arguments (TODO). |
| `--command` | — | — | Command to launch. |
| `--env` | — | — | Shell command environment variables. The value could be a JSON formatted string of environment variables (i.e., \{"name1": "value1"\}) or a file path containing the JSON formatted environment variables. Path should be of the form 'file:///path/to/file'. |
| `--resources` | — | `cpus:1;mem:128` | Resources for the command. |
| `--checkpoint` | — | `false` | Enable checkpointing for the framework. |
| `--framework_capabilities` | — | — | Comma-separated list of optional framework capabilities to enable. RESERVATION_REFINEMENT and TASK_KILLING_STATE are always enabled. PARTITION_AWARE is enabled unless --no-partition-aware is specified. |
| `--containerizer` | — | `medios` | Containerizer to be used. |
| `--effective_capabilities` | — | — | JSON representation of effective system capabilities that should be granted to the command. |
| `--bounding_capabilities` | — | — | JSON representation of system capabilities bounding set that should be applied to the command. |
| `--rlimits` | — | — | JSON representation of POSIX `RLimitInfo` limits applied to the task command before `exec`. |
| `--role` | — | `*` | Role to use when registering. |
| `--kill_after` | — | — | Specifies a delay after which the task is killed (e.g., 10secs, 2mins, etc). |
| `--networks` | — | — | Comma-separated list of networks that the container will join, e.g., `net1,net2`. |
| `--constraints` | — | — | Semicolon-delimited exact-match node attribute constraints (for example `os:linux;rack:r1`). Offers must match every constraint to be accepted. |
| `--principal` | — | — | The principal to use for framework authentication. |
| `--secret` | — | — | The secret to use for framework authentication. |
| `--volumes` | — | — | The value could be a JSON-formatted string of volumes or a file path containing the JSON-formatted volumes. Path must be of the form `file:///path/to/file` or `/path/to/file`. See the `Volume` message in `medios.proto` for the expected format. |
| `--content_type` | — | `protobuf` | The content type to use for scheduler protocol messages. 'json' and 'protobuf' are valid choices. |
| `--tty` | — | `false` | Attach a TTY to the task being launched |
| `--partition_aware` | — | `true` | Enable partition-awareness for the framework. |
| `--version` | — | `false` | Show version and exit. |
