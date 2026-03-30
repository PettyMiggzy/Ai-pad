# AI Pad

AI Pad is a hosted agent platform project built around Artemis as the default Tier 1 agent template.

## Current status

- Next.js app scaffolded
- Artemis draft creation API added
- Local draft persistence added
- Browser UI for creating drafts added
- Supabase-ready database layer added with local JSON fallback

## Environment

Copy `.env.example` to `.env.local` and fill in the values when ready:

```bash
cp .env.example .env.local
```

Required for Supabase mode:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Without those, the app falls back to local draft storage in `.data/agents.json`.

## Development

```bash
npm install
npm run dev
```

## Current routes

- `GET /api/agents`
- `POST /api/agents`
