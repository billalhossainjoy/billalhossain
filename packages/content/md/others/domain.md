---
title: "Portfolio Website & Deployment"
---

Billal Hossain's portfolio website is live at https://billalhossain.dev.

The portfolio is built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. It is deployed on Vercel and served globally through Cloudflare's CDN.

Key URLs:
- Portfolio home: https://billalhossain.dev
- Resume / CV page: https://billalhossain.dev/resume
- Resume PDF download: https://billalhossain.dev/resume.pdf

The website includes:
- An AI-powered chat assistant (bottom-right corner) that can answer questions about Billal in real time, powered by Cloudflare Workers AI and Vectorize (RAG).
- A projects section showcasing real-world applications built with Next.js, NestJS, GraphQL, WebSockets, and more.
- An experience section showing work history.
- A gallery section for photos and media.
- A contact section with email, phone, LinkedIn, GitHub, Facebook, and WhatsApp.

The source code is managed in a pnpm monorepo with Turborepo, containing the portfolio app, a Cloudflare Hono RAG API, and shared packages.
