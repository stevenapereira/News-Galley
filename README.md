News Galley — Autonomous Imprint OS

Newsroom software that scans a site, writes publication-ready articles, ladders them across Domain Authority rungs, pitches real desks, syndicates copies through a host mesh, and stamps a proof ledger. After the retainer clears, the floor runs without a human in the writing loop.

Domain: newsgalley.com. House journal: Galley Review.

## What is unique here

News Galley is not a bulk article spinner. The product is an editorial operating system:

- **Site DNA** — paste a URL; voice, audience, competitors, and keyword gaps are assessed before anything is written.
- **DA ladder** — placements are spread across high, mid, and unfashionable rungs. Authority scores are modeled in-house so the desk is not blocked on Moz or Ahrefs. A live feed can be connected later.
- **Pitch router** — each publication has a desk style (embargo, outline-first, founder letter). Pitches are written to that desk, not blasted.
- **Publisher mesh** — other people’s blogs handshake with a token. Copies flow both ways. Canonical stays on the winning URL; mesh copies noindex.
- **Proof ledger** — every freeze, pitch, accept, and mesh copy is hashed. Chain of custody for clients.
- **PR cadence** — a guaranteed public touch every week so the program never goes silent.
- **Autofill queue** — empty queues brief the next keyword gap themselves. Operators monitor; they do not manufacture copy.

## Retainers

| Desk | Price | Matter |
| --- | --- | --- |
| Signal | $149/mo | 4 articles, 8 pitches, DA 28–61, 2 mesh seats |
| Constellation | $449/mo | 12 articles, 30 pitches, full mid/high ladder, 8 mesh seats, PR cadence |
| Sovereign | $1,290/mo | 40 articles, 120 pitches, exclusives, private mesh, 4-hour empty-queue SLA |

## Run locally

```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# From repo root: backend on :3001, Vite on :5173 proxying /api
bash start.sh
```

Demo desk: `alex@northwind.studio` / `demo1234`
House admin: `desk@newsgalley.com` / `desk1234`

## Human-like writer (your LLM key)

Copy `backend/.env.example` to `backend/.env` and fill **your** key. Do not use any platform/agent key.

```bash
cp backend/.env.example backend/.env
```

Then set (Grok / xAI):

```
USER_LLM_API_KEY=xai-...
USER_LLM_BASE_URL=https://api.x.ai/v1
USER_LLM_MODEL=grok-4
```

Get the key from https://console.x.ai — switching the MonkeyCode chat model does not fill this file.

OpenAI-compatible hosts also work. Point `USER_LLM_BASE_URL` at that host’s `/v1` root.

Without a key, the floor still writes — it uses the house template, which repeats. With a key, each draft is composed against Site DNA + the target desk.

Frontend proxies `/api` to `http://127.0.0.1:3001`. Preview environments that expose a single port should start both processes and open the Vite port.

## Stack

- Frontend: React + Vite
- Backend: Express (in-memory newsroom + worker tick every 4s)
- Charts: Recharts
