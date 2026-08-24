# EcommerceAI — Frontend

Frontend client for **EcommerceAI**, a full-stack e-commerce platform with AI-assisted shopping features. Built with Vite, React, TypeScript, and Tailwind CSS.

# Demo Url - https://aliys.netlify.app

## Tech Stack

- **Build tool:** Vite
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS v4 (no UI library — fully custom components)
- **State management:** Redux Toolkit
- **Data layer:** Apollo Client v4 (GraphQL over HTTP + WebSocket subscriptions)
- **Routing:** React Router
- **Icons:** lucide-react

## Features

- Auth: email/password, OTP, Google OAuth, JWT refresh flow
- Product catalog with per-size stock
- Cart (guest + backend, merges on login)
- Checkout via Razorpay
- Order tracking and history
- Wishlist
- Product reviews
- Real-time notifications (WebSocket)
- AI outfit/size advisor
- RAG-based support chat
- Admin panel (products, categories, orders, users, analytics, audit logs)

## Prerequisites

- Node.js 18+
- The [EcommerceAI backend](#) running and reachable (GraphQL HTTP + WS endpoints)

## Getting Started

```bash
# install dependencies
npm install

# copy env template and fill in values
cp .env.example .env

# start dev server
npm run dev

# production build
npm run build

# preview production build locally
npm run preview
```

## Environment Variables

Create a `.env` file in the project root with the following:

```shellscript
VITE_GRAPHQL_HTTP_URL=
VITE_GRAPHQL_WS_URL=
VITE_RAZORPAY_KEY_ID=
VITE_RECAPTCHA_SITE_KEY=
VITE_GOOGLE_CLIENT_ID=
```

| Variable                  | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `VITE_GRAPHQL_HTTP_URL`   | Backend GraphQL HTTP endpoint, e.g. `https://api.example.com/graphql`                 |
| `VITE_GRAPHQL_WS_URL`     | Backend GraphQL WebSocket endpoint for subscriptions, e.g. `wss://api.example.com/ws` |
| `VITE_RAZORPAY_KEY_ID`    | Razorpay **public** key ID used to open the checkout widget                           |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key                                                          |
| `VITE_GOOGLE_CLIENT_ID`   | Google OAuth client ID for "Sign in with Google"                                      |

All variables are required for the app to function correctly — missing ones will cause GraphQL requests, checkout, captcha, or Google sign-in to fail silently or throw at runtime.

## Deployment

Configured for deployment on Netlify. Set the environment variables above in the Netlify site's build environment settings before deploying — Vite reads them at **build time**, so they must be present when `npm run build` runs, not just at runtime.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level views
├── redux/          # Redux Toolkit store, slices
├── graphql/        # Apollo queries, mutations, subscriptions
├── hooks/          # Custom hooks
├── utils/          # Helpers
└── types/          # TypeScript types
```
