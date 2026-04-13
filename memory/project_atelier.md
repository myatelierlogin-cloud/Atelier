---
name: Atelier Platform Overview
description: Core project context for Atelier — a creator-commerce platform connecting shoppers, creators, and brands via curated "Spaces"
type: project
originSessionId: 09c1b19f-fe7a-47d2-9c45-34c7682f3666
---
**Atelier** is a full-stack React/TypeScript web app built with Vite, Firebase, and Tailwind CSS v4. It is an AI Studio-hosted project (applet ID: 977966bf-4828-44a0-9383-0a08f0937d86).

**Why:** A platform where curated shopping meets creator monetization — creators curate product "Spaces" (shoppable image posts with tagged products), shoppers discover them, and brands run campaigns with creators.

**How to apply:** When making changes, preserve the three-audience architecture (shoppers / creators / brands) and the Firebase-based auth/data model. All styles use the custom Tailwind theme tokens: `alabaster`, `charcoal`, `terracotta`, `sage`.

## Stack
- **Frontend:** React 19, React Router v7, Framer Motion / motion, Lucide icons, Tailwind CSS v4 (`@tailwindcss/vite`)
- **Backend:** Express server (`server.ts`) serving Vite in dev, static in prod. One API route: `POST /api/detect-objects` using Google Cloud Vision.
- **Database:** Firebase Firestore (custom DB: `ai-studio-bf9b188b-e139-4962-858a-92f6180be7ef`)
- **Auth:** Firebase Auth (Google OAuth + email/password)
- **AI:** `@google/genai` (Gemini) used in CreatorSpaces for auto-tagging products in images
- **Validation:** Zod schemas in `src/types/spaces.ts`

## Roles & Auth Flow
- Roles: `shopper | creator | brand | admin | pending`
- New Google-auth users get role `pending` → redirected to `/onboarding` to pick role
- Admin detection: hardcoded email `kristiss747@gmail.com` + `admin_emails` Firestore collection
- `AdminRoleSwitcher` (bottom-right FAB, admin-only) lets admins simulate any role

## Key Pages & Routes
| Route | Component | Purpose |
|---|---|---|
| `/` or `/shop` | ShopHub | Main shopper discovery feed (tabs: Discover, Products, Creators, Brands, Categories, Circles) |
| `/:username` | ConsumerSpace | Public creator storefront with shoppable Spaces |
| `/creator-dashboard` | CreatorSpaces | Creator's Space management + AI product tagging |
| `/creator-dashboard/storefront` | StorefrontBuilder | Creator profile/theme/links editor |
| `/brand-dashboard` | BrandDashboard | Brand analytics, creator discovery, campaign management |
| `/admin-dashboard` | AdminDashboard | User management, admin email list |
| `/dashboard` | DashboardRouter | Redirects to role-appropriate dashboard |
| `/onboarding` | Onboarding | Role selection for new `pending` users |
| `/system-design` | SystemDesign | Internal architecture documentation page |

## Firestore Collections
`users`, `public_profiles`, `spaces`, `products`, `interactions`, `tasks`, `campaigns`, `connections`, `admin_emails`

## Spaces Data Model
Three Space types (Zod-validated discriminated union):
- `SINGLE_ITEM_SPACE` — single affiliate-linked product
- `TAGGABLE_ITEM_SPACE` — image with positioned product tags (x/y % coordinates + marker dots)
- `DIGITAL_ITEM_SPACE` — digital product/download

The `TAGGABLE_ITEM_SPACE` is the primary type — creators upload an image, click to place markers, and AI (Gemini + Google Cloud Vision) identifies and fills in product details.

## Theme System
CSS custom properties in `index.css` define 4 themes: `luxury` (default), `tech`, `creative`, `fashion`. Applied via `data-theme` attribute.

## Key Environment Variables
- `GEMINI_API_KEY` — for Gemini AI product detection
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` — for Google Cloud Vision object detection
- `APP_URL` — self-referential hosting URL
