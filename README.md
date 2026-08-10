# LensLoop — Camera & Event Gear Rental (Frontend)

Next.js 15 (App Router) + TypeScript + Tailwind v4 + hand-built shadcn/ui-style
components, built to consume the Express/Prisma/PostgreSQL backend (formerly
"GearUp").

## Getting started

```bash
npm install
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Open http://localhost:3000.

> **Note on fonts:** this project uses `next/font/google` (Inter, Space
> Grotesk, IBM Plex Mono). That requires outbound access to
> `fonts.googleapis.com` at build time — normal on your machine or any real
> deployment target (Vercel, etc.), just flagging it in case you build behind
> a locked-down proxy.

## Tech stack

- **Framework:** Next.js 15 (App Router, Server + Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-based theme, no `tailwind.config.js`)
- **Components:** shadcn/ui-style primitives, hand-written (the shadcn CLI's
  registry wasn't reachable in the sandbox this was built in — the component
  source is the same either way, just committed directly instead of pulled)
- **Forms:** react-hook-form + Zod
- **Charts:** Recharts
- **Toasts:** Sonner
- **Theming:** next-themes (light/dark)

## Design system

Grounded in the camera/darkroom subject rather than a generic template:

- **Palette:** darkroom charcoal background, tungsten-amber primary,
  viewfinder-cyan secondary (see `src/app/globals.css` for the full token set
  in both light and dark mode)
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (data)
- **Signature motif:** the `.exif-chip` class — gear specs rendered like a
  camera's on-screen data readout (`APERTURE: f/2.8`, `ISO: 400`, etc.) —
  used across gear cards, gear details, and section labels
- **Hero motif:** a "contact sheet" collage of gear thumbnails with frame
  numbers (01A, 02A…), referencing film contact sheets

## Project structure

```
src/
  app/                      Routes (App Router)
    (auth)/login, register
    dashboard/customer/...  Customer dashboard (role-protected)
    dashboard/provider/...  Provider dashboard (role-protected)
    dashboard/admin/...     Admin dashboard (role-protected)
    gear/, gear/[slug]/     Public browse + details
    payment/success, cancel
    about, contact, blog, help, privacy, terms, how-it-works
  components/
    ui/                     Hand-built shadcn-style primitives
    dashboard/              Sidebar shell, stat cards, profile form
    gear/                   Gear card, gear form, rent-now card
  lib/
    api.ts                  Typed fetch client (reads NEXT_PUBLIC_API_URL)
    auth-context.tsx        JWT-based auth context (localStorage + cookie)
    validations.ts          Zod schemas for every form
    content.ts              Empty public-content placeholders (no fabricated records)
  types/                    TypeScript types mirroring the Prisma schema
  middleware.ts             Role-based route protection via JWT cookie
```

## Backend integration status

**Wired for a real backend:**
- `src/lib/api.ts` — typed fetch wrapper, reads `NEXT_PUBLIC_API_URL`,
  attaches the JWT bearer token automatically
- `src/lib/auth-context.tsx` — calls `POST /auth/login`, `POST
  /auth/register`, `GET /auth/me` for real; decodes the JWT to drive route
  protection
- `src/middleware.ts` — protects `/dashboard/customer`, `/dashboard/provider`,
  `/dashboard/admin` based on the JWT's `role` claim
- All Zod schemas in `src/lib/validations.ts` mirror the backend's expected
  payloads (register, login, gear CRUD, rental orders, reviews, profile)

**Public content not yet backed by an API:**
- Gear listings, categories, reviews (home page, `/gear`, `/gear/[slug]`)
- Rental orders, payment history, revenue/category charts (all three
  dashboards)
- Platform users (admin user management)

Blog posts, testimonials, and platform aggregates render no fabricated records
until their backend endpoints are available.

## Not yet built

- Real Stripe/SSLCommerz redirect (the `/pay` page currently simulates a
  delay and redirects to `/payment/success`)
- Image upload UI (gear forms currently take image **URLs**, matching the
  assignment brief's "image URL uploads" wording)
- Additional dashboard aggregate endpoints where available
