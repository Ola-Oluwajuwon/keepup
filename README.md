<div align="center">

# KeepUp

_Habit tracking that helps your resolutions stick._

</div>

## Purpose

KeepUp is a personal productivity app designed to transform New Year resolutions into repeatable habits. Plan meaningful goals, build the behaviors that support them, and monitor daily progress with accountable check-ins.

## Tech Stack

- **Next.js 16** (App Router) for the frontend and API routes
- **Supabase** for authentication and PostgreSQL storage
- **Tailwind CSS** for styling and rapid UI building
- **TypeScript** for type safety across the stack

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Add your Supabase project credentials to `.env.local` (created for you in this repo).

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Visit `http://localhost:3000` to explore the app.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Both keys are available in your Supabase dashboard under **Project Settings → API**.

## Database Schema (Supabase SQL)

Run the following script in the Supabase SQL Editor to create the core tables:

```sql
create table if not exists public.resolutions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  resolution_id uuid not null references public.resolutions (id) on delete cascade,
  title text not null,
  frequency text check (frequency in ('daily', 'weekly')) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  checkin_date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (habit_id, checkin_date)
);
```

## Development Commands

- `pnpm dev` – start the local Next.js dev server
- `pnpm lint` – run ESLint with the project configuration
- `pnpm build` – generate an optimized production build
- `pnpm start` – serve the production build

## Next Steps

- Connect forms to Supabase and hydrate the dashboard with live data
- Add reminder scheduling and analytics
- Harden authentication with Supabase Auth Helpers middleware
