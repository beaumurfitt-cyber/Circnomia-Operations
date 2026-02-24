# Circnomia Sales Agent (MVP)

## Stack
- Next.js App Router + TypeScript + Tailwind
- Next.js API routes
- Prisma + SQLite

## Setup
1. `npm install`
2. `cp .env.example .env`
3. `npx prisma migrate dev --name init`
4. `npm run prisma:seed`
5. `npm run dev`

## Prisma migration command
- Initial migration: `npx prisma migrate dev --name init`
- Regenerate client: `npm run prisma:generate`

## Key capabilities
- Accounts + Contacts CRUD
- URL-based enrichment with source tracking
- DISC communication-style hypothesis (non-sensitive)
- Outreach draft generation (Email, LinkedIn DM, Call opener; 3 tones)
- Deterministic account scoring + next action

## Folder structure
```text
app/
  accounts/
  contacts/
  settings/
  api/
components/
lib/
prisma/
tests/
```

## Safety constraints implemented
- DISC is communication-style hypothesis only.
- Confidence and evidence required.
- If evidence count <2 => Unknown and confidence <=40.
- No sensitive personal attribute inference.
- No automated sending of messages.
