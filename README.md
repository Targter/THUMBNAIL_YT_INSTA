# ⚡ Thumbnail Generator — Real-Time Architecture with Redis Pub/Sub + SSE

> **A production-grade, event-driven thumbnail generation pipeline.**  
> Built on Redis Pub/Sub + Server-Sent Events. No polling. No WebSocket overhead. Just the right tool for the job.

---

## Table of Contents

- [Overview](#overview)
- [Why This Architecture Wins](#why-this-architecture-wins)
- [Technology Decision: SSE vs WebSocket vs Polling](#technology-decision-sse-vs-websocket-vs-polling)
- [Technology Decision: Redis Pub/Sub vs Streams vs BullMQ](#technology-decision-redis-pubsub-vs-streams-vs-bullmq)
- [System Architecture](#system-architecture)
- [Phase Breakdown](#phase-breakdown)
  - [Phase 1 — Request (Sync, Fast)](#phase-1--request-sync-fast)
  - [Phase 2 — Processing (Async, Isolated)](#phase-2--processing-async-isolated)
  - [Phase 3 — Delivery (Real-Time, Efficient)](#phase-3--delivery-real-time-efficient)
- [Data Flow Diagram](#data-flow-diagram)
- [Redis Event Schema](#redis-event-schema)
- [Non-Obvious Design Decisions](#non-obvious-design-decisions)
- [Scalability Model](#scalability-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Engineering Assessment](#engineering-assessment)

---

## Overview

This system generates thumbnails on-demand — accepting a job request, processing it asynchronously through workers, and streaming real-time progress back to the client using **Server-Sent Events (SSE)** over a **Redis Pub/Sub** backbone.

The architecture was intentionally designed around three core principles:

1. **Zero polling** — Clients receive updates the moment they're available, not on a schedule.
2. **Loose coupling** — The API, workers, and delivery layers are fully decoupled via Redis.
3. **Right-sized primitives** — SSE for one-way streaming, Pub/Sub for ephemeral fan-out, KV for durable state.

This is not an over-engineered system. Every choice was made to eliminate waste — in network, compute, and complexity.

---

## Why This Architecture Wins

Most thumbnail generation systems default to one of two naive patterns:

- **Client polls `/status` every 2 seconds** → wasteful, delayed, expensive at scale.
- **WebSocket connection per job** → bidirectional overhead for a one-way problem.

This system uses neither. Here's the reasoning:

| Requirement | How This System Solves It |
|---|---|
| Non-blocking API responses | Jobs are queued instantly; `jobId` returned in < 10ms |
| Real-time progress without polling | Redis Pub/Sub pushes events the moment workers emit them |
| Efficient client delivery | SSE streams events over a single persistent HTTP connection |
| Resilience to reconnections | Job state stored in Redis KV / DB — always recoverable |
| Horizontal scale | One Redis subscriber per server; in-memory fan-out to N clients |
| Worker isolation | Workers are stateless; Redis is the only shared boundary |

---

## Technology Decision: SSE vs WebSocket vs Polling

This was the most visible architectural choice. Here is the full reasoning.

### Polling — Rejected

```
Client → GET /status?jobId=abc123  (every 2s)
Server → { status: "processing", progress: 40 }
Client → GET /status?jobId=abc123  (2s later)
Server → { status: "processing", progress: 65 }
```

**Why it was rejected:**

- Generates N × clients × frequency requests per second regardless of whether anything changed.
- Introduces artificial latency equal to the poll interval (up to 2–5 seconds of delay per update).
- Increases infrastructure cost linearly with client count and poll frequency.
- Requires the server to handle state reads on every tick — not just on state change.

Polling is the right choice when the update interval is unpredictable and infrequent (e.g., checking a weekly report). For a sub-60-second job pipeline, it is wasteful by design.

### WebSocket — Rejected

```
Client ↔ Server (full-duplex, persistent TCP connection)
```

**Why it was rejected:**

- WebSockets are bidirectional by protocol. This system has no need for client → server messages after job submission.
- Requires a separate upgrade handshake and a stateful connection layer.
- Load balancers and proxies (nginx, AWS ALB) require special sticky-session or upgrade configuration.
- More complex to implement, debug, and monitor than necessary for a one-way data flow.
- Reconnection logic is non-trivial and must be hand-implemented.

WebSockets are correct when the client needs to send data mid-stream (e.g., live chat, collaborative editing, multiplayer games). For job progress delivery, they are over-specified.

### Server-Sent Events (SSE) — Chosen ✅

```
Client → GET /events?jobId=abc123   (one request, persistent)
Server → data: {"status":"rendering","progress":40}
Server → data: {"status":"uploading","progress":80}
Server → data: {"status":"completed","url":"https://..."}
```

**Why SSE is correct here:**

- Native HTTP — works through every proxy, CDN, and load balancer without configuration.
- Automatic reconnection is built into the browser EventSource API at zero cost.
- One-way by design — perfectly matches the job progress use case.
- Text-based, human-readable events during debugging.
- No handshake overhead. The first request is the connection.
- HTTP/2 multiplexes multiple SSE streams over one TCP connection.

### Decision Matrix

| Criterion | Polling | WebSocket | SSE (chosen) |
|---|---|---|---|
| Network efficiency | ❌ Wasteful | ✅ Efficient | ✅ Efficient |
| Latency | ❌ Poll-interval delay | ✅ Near real-time | ✅ Near real-time |
| Infra complexity | ✅ Simple | ❌ Upgrade + sticky sessions | ✅ Plain HTTP |
| Client implementation | Medium | Complex | ✅ Native EventSource |
| Reconnection handling | Manual | Manual | ✅ Automatic |
| Proxy/CDN compatibility | ✅ Yes | ⚠️ Requires config | ✅ Yes |
| Bidirectional | Yes (wasted here) | ✅ Yes | No (not needed) |
| Fit for this system | ❌ | ❌ | ✅ |

**Verdict:** SSE is the correct primitive for any system where the server needs to push sequential updates to a client for a bounded job. This is that system.

---

## Technology Decision: Redis Pub/Sub vs Streams vs BullMQ

### Redis Pub/Sub — Chosen ✅

Pub/Sub provides channel-based, fire-and-forget message broadcasting.

**Why it was chosen for real-time event delivery:**

- Zero latency from publish to subscriber — no polling the data structure.
- Fan-out by default — multiple SSE servers receive every worker event simultaneously.
- No persistence overhead — events are ephemeral and don't need durability at the delivery layer.
- Extremely simple mental model: publish a `jobId` channel event, all subscribers receive it.

**The honest limitation:** If no subscriber is listening when an event is published, the event is gone. This is acceptable because SSE connections are established before or immediately after job submission, and final state is stored durably.

### Redis Streams — Considered

Redis Streams provide an ordered, persistent, consumer-group-aware log.

**When Streams would be the right choice:**
- Jobs take > 5 minutes and reconnections mid-job are common.
- You need acknowledgement that a worker processed the message.
- You want replay capability for debugging or auditing.
- You are building a system with retries and dead-letter queues.

**Why Streams were not chosen for this system:** The thumbnail job lifecycle is short (seconds to low minutes). The complexity of consumer groups and offset management is not justified. The Pub/Sub model is sufficient and dramatically simpler.

### Hybrid Pattern (Implemented)

```
Pub/Sub  →  real-time event streaming (delivery layer)
Redis KV →  durable final job state (recovery layer)
```

This hybrid eliminates the one weakness of pure Pub/Sub (missed events on reconnect) without introducing the full complexity of Streams. A reconnecting client fetches final state from Redis KV or the database, then optionally re-attaches to Pub/Sub for any remaining events.

### Decision Matrix

| Criterion | Pub/Sub (chosen) | Redis Streams | BullMQ |
|---|---|---|---|
| Latency | ✅ Microseconds | ✅ Microseconds | ⚠️ Poll-based |
| Durability | ❌ Ephemeral | ✅ Persistent | ✅ Persistent |
| Fan-out | ✅ Native | ⚠️ Manual | ❌ Not designed for it |
| Complexity | ✅ Minimal | ⚠️ Consumer groups | ⚠️ Queue management |
| Retry / DLQ | ❌ Not built-in | ✅ Yes | ✅ Yes |
| Right for real-time delivery | ✅ | ⚠️ Overkill | ❌ |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                  │
│   POST /generate  ──────────────────────────────────────────►   │
│                                                                  │
│   ◄──────── { jobId: "abc123" } ───────────────────────────     │
│                                                                  │
│   GET /events?jobId=abc123  ────────────────────────────────►   │
│   ◄──── data: { status, progress, url }  (SSE stream) ──────    │
└─────────────────────────────────────────────────────────────────┘
              │                          ▲
              ▼                          │
┌─────────────────────┐      ┌──────────────────────┐
│      API SERVER      │      │     SSE SERVER        │
│                      │      │                       │
│  • Validate request  │      │  • Subscribe Redis    │
│  • Generate jobId    │      │  • Filter by jobId    │
│  • Publish to Redis  │      │  • Stream to client   │
│  • Return jobId      │      │                       │
└─────────┬────────────┘      └──────────┬────────────┘
          │                              │
          ▼                              ▲
┌─────────────────────────────────────────────────────┐
│                    REDIS                              │
│                                                       │
│   Pub/Sub Channel: job:abc123                        │
│   KV Store:        job_state:abc123  →  { ... }      │
└─────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│   WORKER POOL        │
│                      │
│  • Render SVG/Canvas │
│  • Convert to PNG    │
│  • Upload to S3      │
│  • Publish progress  │
└─────────────────────┘
```

---

## Phase Breakdown

### Phase 1 — Request (Sync, Fast)

The API layer is responsible for one thing: accepting a job and returning quickly.

```
Client                    API Server                   Redis
  │                           │                          │
  │── POST /generate ─────►   │                          │
  │   { text, colors,         │── PUBLISH job:abc123 ──► │
  │     layout, imageRefs }   │   { status: "queued" }   │
  │                           │── SET job_state:abc123 ► │
  │◄── { jobId: "abc123" } ── │   { status: "queued" }   │
```

**Key design principle:** The API does not wait for rendering. It queues the job and returns the `jobId` in under 10ms. Client latency is decoupled from worker performance entirely.

### Phase 2 — Processing (Async, Isolated)

Workers are stateless subscribers that consume from the job queue, perform rendering, and emit progress events.

```
Redis                   Worker                      Redis (Pub/Sub)
  │                       │                              │
  │── Job available ────► │                              │
  │                       │── Render SVG ──────────────► PUBLISH job:abc123
  │                       │   progress: 30%              { status: "rendering", progress: 30 }
  │                       │                              │
  │                       │── Convert PNG ─────────────► PUBLISH job:abc123
  │                       │   progress: 65%              { status: "converting", progress: 65 }
  │                       │                              │
  │                       │── Upload S3 ───────────────► PUBLISH job:abc123
  │                       │   progress: 90%              { status: "uploading", progress: 90 }
  │                       │                              │
  │                       │── Complete ────────────────► PUBLISH job:abc123
  │                       │                              { status: "completed", url: "https://..." }
  │                       │                              │
  │                       │── SET job_state:abc123 ───► Redis KV
```

**Key design principle:** Workers are idempotent. Processing the same `jobId` twice produces the same output. This enables safe retries without corruption.

### Phase 3 — Delivery (Real-Time, Efficient)

The SSE endpoint bridges Redis Pub/Sub to the HTTP client.

```
Client                  SSE Server               Redis Pub/Sub
  │                         │                          │
  │── GET /events? ──────►  │                          │
  │   jobId=abc123          │── SUBSCRIBE job:abc123 ► │
  │                         │                          │
  │                         │◄── EVENT: rendering ──── │
  │◄── data: rendering ──── │                          │
  │                         │◄── EVENT: uploading ──── │
  │◄── data: uploading ──── │                          │
  │                         │◄── EVENT: completed ──── │
  │◄── data: completed ──── │                          │
  │   (connection closes)   │── UNSUBSCRIBE ─────────► │
```

**Key design principle:** The SSE server does not open one Redis subscription per connected client. It maintains one subscription per server instance and multiplexes events to all connected clients in memory. This is the critical fan-out optimization that allows horizontal scaling without Redis connection explosion.

---

## Data Flow Diagram

```
[Client]
    │
    │  POST /generate { text, colors, layout }
    ▼
[API Server]
    │  1. Validate payload
    │  2. Generate jobId (UUID v4)
    │  3. PUBLISH redis:job:abc123 { status: "queued" }
    │  4. SET redis:job_state:abc123 { status: "queued", createdAt: ... }
    │  5. Enqueue worker task
    │  6. Return { jobId: "abc123" }
    │
    │  (Client immediately opens SSE connection)
    │
[SSE Server]  ◄──────── GET /events?jobId=abc123
    │  1. Fetch current state from Redis KV (handles late connections)
    │  2. SUBSCRIBE redis:job:abc123
    │  3. Stream current state immediately
    │  4. Forward all subsequent Pub/Sub events to client
    │
[Worker Pool]
    │  1. Dequeue job task
    │  2. PUBLISH progress events at each milestone
    │  3. On complete: SET redis:job_state:abc123 { status: "completed", url }
    │  4. PUBLISH final completion event
    │
[Client]
    │  Receives real-time stream:
    │  data: { status: "queued",     progress: 0   }
    │  data: { status: "rendering",  progress: 30  }
    │  data: { status: "converting", progress: 65  }
    │  data: { status: "uploading",  progress: 85  }
    │  data: { status: "completed",  progress: 100, url: "https://..." }
    │  (EventSource closes)
```

---

## Redis Event Schema

Every event published to `job:{jobId}` follows this schema:

```json
{
  "jobId": "abc123",
  "status": "queued | rendering | converting | uploading | completed | failed",
  "progress": 0,
  "message": "Human-readable status description",
  "url": null,
  "error": null,
  "timestamp": "2025-02-17T10:30:00.000Z"
}
```

**Status lifecycle:**

```
queued → rendering → converting → uploading → completed
                                             → failed
```

**Redis KV key pattern:**

```
job_state:{jobId}   →  Full job object (JSON)
job_meta:{jobId}    →  Metadata: createdAt, clientId, ttl
```

Keys are set with a TTL of 24 hours. Clients reconnecting within this window will always recover final state.

---

## Non-Obvious Design Decisions

### 1. Job State Must Live Outside Pub/Sub

Pub/Sub is ephemeral. If a client connects after the job completes, it will receive no events from Pub/Sub — they were never stored.

**Solution:** On every status change, the worker also writes to Redis KV:

```
SET job_state:abc123 { status: "completed", url: "..." } EX 86400
```

The SSE endpoint reads this key immediately on connection. If the job is already done, it sends the final state synchronously and never opens a Pub/Sub subscription.

This pattern handles: late connections, browser tab switches, mobile background/foreground transitions, and network interruptions.

### 2. One Redis Subscriber Per Server Instance

A naive implementation opens one Redis SUBSCRIBE connection per connected SSE client. At 1,000 concurrent clients, that is 1,000 Redis connections — which breaks the Redis connection limit and creates significant overhead.

**The correct pattern:**

```
Server Instance
├── 1x Redis SUBSCRIBE connection (shared)
├── In-memory Map: { jobId → Set<SSEClient> }
│
│  On Redis event:
│  1. Parse jobId from event
│  2. Lookup Set<SSEClient> for that jobId
│  3. Write event to each client's response stream
```

One Redis subscriber per server. N clients per server. Clean, scalable, no connection ceiling.

### 3. SSE Cleanup on Client Disconnect

HTTP connections drop. Mobile clients switch networks. Browsers close tabs.

Every SSE handler must clean up its in-memory registration on disconnect:

```
request.on('close', () => {
  clientMap.get(jobId)?.delete(res)
  if (clientMap.get(jobId)?.size === 0) {
    clientMap.delete(jobId)
  }
})
```

Without this, the server accumulates dead references and eventually runs out of memory.

### 4. Worker Idempotency

If a worker crashes mid-job and a retry picks up the same `jobId`, it must produce the same output without corrupting state.

**Implementation contract:**
- Workers check `job_state:{jobId}` before starting. If status is `completed`, they no-emit and exit.
- Rendering uses deterministic inputs (same config → same output). No random seeds unless stored per job.
- S3 uploads use the `jobId` as the key — re-uploading the same file is a no-op.

### 5. Reconnection with Last-Event-ID

The browser EventSource API automatically sends `Last-Event-ID` on reconnect. The SSE server can use this to skip already-delivered events:

```
GET /events?jobId=abc123
Last-Event-ID: rendering
```

The server responds with only events that occurred after `rendering` status. This prevents the client from re-processing duplicate progress updates after a network blip.

### 6. Rate Limiting the SSE Endpoint

SSE endpoints are persistent connections. Without rate limiting, a single client can open 100 connections and exhaust server descriptors.

**Recommended limits:**
- Max 3 concurrent SSE connections per authenticated user.
- Max 10 concurrent SSE connections per IP (unauthenticated).
- Connection TTL of 120 seconds — clients must reconnect, preventing zombie connections.

---

## Scalability Model

### Horizontal Scaling

Because the API server, SSE server, and workers are fully decoupled through Redis, each layer scales independently:

```
                         ┌─────────────────┐
                         │   Load Balancer  │
                         └────────┬────────┘
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                   ▼
        [SSE Server 1]    [SSE Server 2]      [SSE Server 3]
               │                  │                   │
               └──────────────────┴───────────────────┘
                                  │
                          [Redis Cluster]
                                  │
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                   ▼
          [Worker 1]        [Worker 2]          [Worker 3]
```

**Scaling characteristics:**

| Layer | Scale Trigger | Scale Action |
|---|---|---|
| API Server | Request throughput | Add instances (stateless) |
| SSE Server | Concurrent connections | Add instances (one Redis sub each) |
| Workers | Job queue depth | Add workers (stateless) |
| Redis | Memory / throughput | Redis Cluster or Redis Sentinel |

### Connection Math

With the in-memory multiplexing pattern:

- **10 SSE server instances** × **1 Redis subscriber each** = **10 Redis connections** for the delivery layer.
- Each SSE server handles **N concurrent clients** limited only by OS file descriptors (typically 65,536 per process).
- Total concurrent clients supported: **10 × 65,536 = 655,360** with 10 Redis connections for Pub/Sub delivery.

This is the architecture's most important scalability property.

---

## Project Structure

```
thumbnail-generator/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── generate.ts       # POST /generate — job submission
│   │   │   └── events.ts         # GET /events — SSE endpoint
│   │   └── middleware/
│   │       ├── auth.ts
│   │       └── rateLimit.ts
│   │
│   ├── workers/
│   │   ├── thumbnailWorker.ts    # Core render → convert → upload pipeline
│   │   ├── renderer.ts           # SVG / Canvas rendering logic
│   │   └── uploader.ts           # S3 upload with progress emission
│   │
│   ├── services/
│   │   ├── redis.ts              # Redis client (Pub/Sub + KV)
│   │   ├── jobStore.ts           # Job state CRUD (Redis KV)
│   │   └── pubsub.ts             # Publisher and subscriber abstractions
│   │
│   ├── sse/
│   │   ├── sseManager.ts         # In-memory client map + fan-out logic
│   │   └── sseHandler.ts         # SSE response writer
│   │
│   └── types/
│       └── job.ts                # JobEvent, JobStatus, JobState types
│
├── docker-compose.yml             # Redis + API + Worker local stack
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Redis 7+
- Docker (optional, for local stack)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/your-org/thumbnail-generator
cd thumbnail-generator

# Install dependencies
npm install

# Start Redis (via Docker)
docker-compose up redis -d

# Copy environment variables
cp .env.example .env

# Start API server
npm run dev:api

# Start SSE server (can be same process or separate)
npm run dev:sse

# Start worker(s)
npm run dev:worker
```

### Generate a thumbnail

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "10 things I learned this week",
    "colors": { "background": "#0a0a0a", "text": "#ffffff", "accent": "#6366f1" },
    "layout": "centered",
    "imageRefs": []
  }'

# Response
{ "jobId": "abc123" }
```

### Connect to SSE stream

```bash
curl -N http://localhost:3000/events?jobId=abc123

# Output (streamed)
data: {"status":"queued","progress":0}
data: {"status":"rendering","progress":30}
data: {"status":"converting","progress":65}
data: {"status":"uploading","progress":85}
data: {"status":"completed","progress":100,"url":"https://..."}
```

### Browser (EventSource)

```javascript
const source = new EventSource(`/events?jobId=${jobId}`);

source.onmessage = (event) => {
  const { status, progress, url } = JSON.parse(event.data);
  updateUI(status, progress);

  if (status === 'completed') {
    showThumbnail(url);
    source.close();
  }
};

source.onerror = () => {
  // EventSource reconnects automatically
  console.log('Reconnecting...');
};
```

---

## Environment Variables

```env
# Redis
REDIS_URL=redis://localhost:6379
REDIS_JOB_STATE_TTL=86400          # 24 hours in seconds

# Worker
WORKER_CONCURRENCY=5               # Parallel jobs per worker process
S3_BUCKET=thumbnails-prod
S3_REGION=us-east-1

# SSE
SSE_MAX_CONNECTIONS_PER_USER=3
SSE_CONNECTION_TTL_MS=120000       # 2 minutes

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

---

## Engineering Assessment

This architecture represents a mature, deliberate set of trade-offs — not a trendy stack.

**What makes it strong:**

- **Correct primitive selection.** SSE for one-way streaming, Pub/Sub for fan-out delivery, KV for durable state. No tool is used outside its design intent.
- **Decoupled layers.** API, workers, and SSE delivery share no in-process state. Each is independently deployable and independently scalable.
- **No polling at any layer.** Not in the client, not in the SSE server, not in the workers. The entire pipeline is event-driven from submission to delivery.
- **Reconnection safety.** A client that disconnects and reconnects will always recover correct state, even if the job completed during the interruption.
- **Linear scaling.** Adding a worker increases throughput. Adding an SSE server increases concurrent client capacity. Redis is the only shared boundary.

**When to revisit:**

- Jobs regularly exceed 10 minutes → consider Redis Streams with consumer group acknowledgements.
- Audit trail required for every event → consider Redis Streams or a persistent event log.
- Client needs to cancel or modify jobs mid-processing → consider WebSockets.
- Multi-tenant isolation required → namespace Redis channels per tenant and add per-channel rate limits.

---

> Built with Redis Pub/Sub · Server-Sent Events · Node.js · TypeScript  
> Architecture: Event-driven, async-first, zero polling
