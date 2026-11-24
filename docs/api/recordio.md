---
title: RecordIO Framing
doc_type: reference
---

# RecordIO Data Format

## Overview

RecordIO is the name for a set of binary data exchange formats.
The basic idea is to divide the data into individual chunks, called 'records',
and then to prepend to every record its length in bytes, followed by the data.

Since there is no formal specification of the RecordIO format, there tend
to be slight incompatibilities between RecordIO implementations. Common
differences include, for example, a magic value at the beginning of the
stream to indicate the stream format, encoding the record length using
fixed-size fields with native integers or extra fields to support compressed
record content.

Therefore, when using a third-party library, one needs to verify that
the implementation matches the RecordIO format used by Medios, as described
below.


## Medios RecordIO Format

The [BNF grammar](http://www.w3.org/Protocols/rfc2616/rfc2616-sec2.html#sec2.1)
for a RecordIO-encoded streaming response is:

```
    records         = *record

    record          = record-size LF record-data

    record-size     = 1*DIGIT
    record-data     = record-size(OCTET)
```

`record-size` should be interpreted as an unsigned 64-bit integer (`uint64`).

For example, a stream may look like:

```
128\n
{"type": "SUBSCRIBED","subscribed": {"framework_id": {"value":"12220-3440-12532-2345"},"heartbeat_interval_seconds":15.0}20\n
{"type":"HEARTBEAT"}675\n
...
```

In pseudo-code, this could be parsed with something like the following:

```
  while (true) {
    do {
      lengthBytes = readline()
    } while (lengthBytes.length < 1)

    messageLength = parseInt(lengthBytes);
    messageBytes = read(messageLength);
    process(messageBytes);
  }
```

Network intermediaries (e.g., proxies) are free to change the chunk
boundaries; this should not have any effect on the recipient application.


## Streaming HTTP requests and header negotiation

RecordIO framing is used on both `/api/v1/scheduler` and streaming `/api/v1` Operator API calls, with one important difference in HTTP header negotiation:

- **Scheduler API (`POST /api/v1/scheduler` `SUBSCRIBE`):** set `Accept: application/json` (or `Accept: application/x-protobuf`). The controller responds with `Content-Type: application/json` (or `application/x-protobuf`) and streams RecordIO-framed events in the body. Do **not** send `Accept: application/recordio` or `Message-Accept` to `/api/v1/scheduler` (the controller returns `406 Not Acceptable` if `Accept` does not allow `application/json` or `application/x-protobuf`).
- **Node Operator streaming API (`POST /api/v1`, for example `ATTACH_CONTAINER_OUTPUT` / `ATTACH_CONTAINER_INPUT`):** clients may request RecordIO framing explicitly by setting `Accept: application/recordio` together with `Message-Accept: application/json` (or `application/x-protobuf`). The server responds with `Content-Type: application/recordio` and `Message-Content-Type: application/json` (or `application/x-protobuf`). For non-streaming requests (`Accept: application/json` or `application/x-protobuf`), `Message-Accept` must not be set.

Currently, the only supported inner media types for both endpoints are `application/json` and `application/x-protobuf`.
