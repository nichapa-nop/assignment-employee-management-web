# Employee Management Web

Web UI for managing employee records (search, filter, CRUD).

Backend: [assignment-employee-management-api](https://github.com/nichapa-nop/assignment-employee-management-api)

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript

## Prerequisites

- Node.js 22+
- Backend API running (see the API repository)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:3001/api` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Lint |

## Project structure

```
src/
├── app/                    # Next.js routes
├── components/ui/          # reusable UI primitives
├── features/employees/     # components/, hooks/
├── lib/                    # API client, formatters
└── types/                  # shared TypeScript types
```
