---
title: AI Agents as Frameworks
doc_type: tutorial
---

# Write a Minimal HTTP Scheduler (AI Agents & Scripts)

Any program or LLM agent that can send HTTP/1.1 JSON requests and read a RecordIO stream can act as a Medios framework with no SDK required.

## What you need

- A reachable controller at `http://<controller>:5050` with at least one registered node.
- Python 3 with the `requests` package installed.
- An OS username (`<node-user>`) that exists on the node.

## 1. Run a minimal scheduler loop

Save this script as `scheduler.py` and replace `<controller>` and `<node-user>`:

```python
import json
import sys
import requests

CONTROLLER = "http://<controller>:5050"
NODE_USER = "<node-user>"

subscribe = {
    "type": "SUBSCRIBE",
    "subscribe": {
        "framework_info": {
            "user": NODE_USER,
            "name": "minimal-agent-framework",
            "principal": "team:agents",
        }
    },
}

r = requests.post(
    f"{CONTROLLER}/api/v1/scheduler",
    json=subscribe,
    stream=True,
    headers={"Accept": "application/json"},
)
r.raise_for_status()

stream_id = r.headers["Medios-Stream-Id"]
framework_id = None
submitted = False


def post_call(payload):
    resp = requests.post(
        f"{CONTROLLER}/api/v1/scheduler",
        json=payload,
        headers={"Medios-Stream-Id": stream_id},
    )
    resp.raise_for_status()


def carve_scalar(offer, name, amount):
    for res in offer.get("resources", []):
        if res["name"] == name and res["type"] == "SCALAR" and res["scalar"]["value"] >= amount:
            carved = json.loads(json.dumps(res))
            carved["scalar"]["value"] = amount
            return carved
    return None


buf = b""
for chunk in r.iter_content(chunk_size=4096):
    buf += chunk
    while b"\n" in buf:
        size_str, _, rest = buf.partition(b"\n")
        if not size_str.strip():
            buf = rest
            continue
        size = int(size_str)
        if len(rest) < size:
            buf = size_str + b"\n" + rest
            break
        event = json.loads(rest[:size])
        buf = rest[size:]

        if event["type"] == "SUBSCRIBED":
            framework_id = event["subscribed"]["framework_id"]["value"]
            print(f"subscribed as {framework_id}")

        elif event["type"] == "OFFERS":
            for offer in event["offers"]["offers"]:
                cpus = carve_scalar(offer, "cpus", 0.5)
                mem = carve_scalar(offer, "mem", 128)
                if not submitted and cpus and mem:
                    task = {
                        "name": "hello-agent",
                        "task_id": {"value": "hello-agent-1"},
                        "node_id": offer["node_id"],
                        "principal": "operator:alice",
                        "resources": [cpus, mem],
                        "command": {"shell": True, "value": "echo hello-from-agent"},
                    }
                    post_call({
                        "type": "ACCEPT",
                        "framework_id": {"value": framework_id},
                        "accept": {
                            "offer_ids": [offer["id"]],
                            "operations": [{"type": "LAUNCH", "launch": {"task_infos": [task]}}],
                        },
                    })
                    post_call({"type": "SUPPRESS", "framework_id": {"value": framework_id}})
                    submitted = True
                else:
                    post_call({
                        "type": "DECLINE",
                        "framework_id": {"value": framework_id},
                        "decline": {
                            "offer_ids": [offer["id"]],
                            "filters": {"refuse_seconds": 120},
                        },
                    })

        elif event["type"] == "UPDATE":
            status = event["update"]["status"]
            print(f"task {status['task_id']['value']} -> {status['state']}")
            if status.get("uuid"):
                post_call({
                    "type": "ACKNOWLEDGE",
                    "framework_id": {"value": framework_id},
                    "acknowledge": {
                        "node_id": status["node_id"],
                        "task_id": status["task_id"],
                        "uuid": status["uuid"],
                    },
                })
            if status["state"] in (
                "TASK_FINISHED",
                "TASK_FAILED",
                "TASK_KILLED",
                "TASK_ERROR",
                "TASK_DROPPED",
                "TASK_LOST",
                "TASK_GONE",
                "TASK_GONE_BY_OPERATOR",
            ):
                post_call({"type": "TEARDOWN", "framework_id": {"value": framework_id}})
                sys.exit(0)
```

## 2. Run it

```sh
python3 scheduler.py
```

```text
subscribed as <framework-id>
task hello-agent-1 -> TASK_STARTING
task hello-agent-1 -> TASK_RUNNING
task hello-agent-1 -> TASK_FINISHED
```

## What you built

Your script subscribed over RecordIO, carved resources without dropping offer metadata, suppressed idle offers, acknowledged status updates, and tore down cleanly.

## What's next

- [OpenAPI Discovery & Specs](/api/openapi) — inspect the full schema or generate typed clients
- [Go SDK](/go-sdk) — production reference SDK
- [Scheduler Contract & Best Practices](/frameworks/contract)
