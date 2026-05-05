# Tagmart Super Market — Full-Stack E-Commerce

Built for TheCodex Software Solutions as a client project.

## Overview

Full-stack grocery/retail e-commerce platform with a customer-facing storefront and an admin management panel. pnpm workspace monorepo with a React + Vite frontend and Express + PostgreSQL backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Wouter (routing) + TanStack Query + shadcn/ui + Tailwind CSS v4
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- **Charts**: Recharts (admin dashboard)
- **Build**: esbuild (CJS bundle)

## Packages

| Package | Path | Description |
|---|---|---|
| `@workspace/tagmart` | `artifacts/tagmart` | Customer storefront (React Vite SPA, port from `$PORT`) |
| `@workspace/api-server` | `artifacts/api-server` | REST API server (Express 5, port 8080) |
| `@workspace/api-spec` | `lib/api-spec` | OpenAPI 3.0 spec + Orval codegen config |
| `@workspace/api-client-react` | `lib/api-client-react` | Generated React Query hooks (from Orval) |
| `@workspace/api-zod` | `lib/api-zod` | Generated Zod schemas (from Orval) |
| `@workspace/db` | `lib/db` | Drizzle schema + migrations |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Features Implemented

### Customer Storefront (`/`)
- **Homepage** — hero section, feature cards, category grid, featured products
- **Shop** (`/shop`) — product grid with category sidebar filter, search, SALE badges, star ratings
- **Product Detail** (`/product/:id`) — image, discount badge, star rating, quantity selector, add to cart
- **Cart** (`/cart`) — item list with qty controls, order summary, free delivery
- **Checkout** (`/checkout`) — delivery address/phone form, order summary, success confirmation
- **Login** (`/login`) — email/password with password show/hide, redirects admin to dashboard
- **Register** (`/register`) — name/email/phone/password, auto-login on success
- **My Orders** (`/orders`) — order list with status badges (auth-protected)
- **Order Detail** (`/order/:id`) — progress stepper, item list, delivery info

### Admin Panel (`/admin`)
- **Admin Login** (`/admin`) — dark-themed portal, admin-only access
- **Dashboard** (`/admin/dashboard`) — 8 KPI cards, bar chart (revenue by category), recent orders table
- **Orders** (`/admin/orders`) — full order table with status filter dropdown, inline status update
- **Products** (`/admin/products`) — product table with image previews, add product dialog, delete
- **Categories** (`/admin/categories`) — category card grid, add category dialog (auto-generates slug), delete

## Auth

Token-based auth stored in `localStorage` as `tagmart_token` / `tagmart_user`. Fetch is monkey-patched in `main.tsx` to automatically attach `Authorization: Bearer <token>` to every request.

Default admin: `admin@tagmart.com` / `admin123`

## Database Schema

Tables: `users`, `categories`, `products`, `orders`, `order_items`
Enums: `user_role` (customer, admin), `order_status` (pending → confirmed → processing → shipped → delivered | cancelled)

Seeded: 1 admin, 8 categories, 21 products across all categories.

## Theme

Green (`--secondary: teal`) + Orange (`--primary: burnt orange`) brand colors on a warm cream background. Dark charcoal footer and admin sidebar.

## Important Notes

- `lib/api-zod/src/index.ts` must only contain `export * from "./generated/api"` — codegen overwrites it; do not add extra exports.
- Admin layout component (`AdminLayout`) is exported from `admin/dashboard.tsx` and re-used across all admin pages.
- Do NOT add `schemas` option back to `lib/api-spec/orval.config.ts` — it causes duplicate export errors.
