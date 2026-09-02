# Royal City Labs — Website Redesign Prototype

Next.js App Router prototype for Royal City Labs, based on the supplied institutional summary and 2026 brand guideline.

## Brand system used
- Primary: `#042D7B`
- Accent orange: `#D95F0F`
- Accent blue: `#2AA8FF`
- Subtext: `#A7B0BA`
- Main text: `#2F4357`
- Font roles: Exo 2 (logo/headlines), Saira (headers/navigation), Barlow (body text)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000/en

French: http://localhost:3000/fr

## Production build

```bash
npm run build
npm start
```

## Notes
- The 3D hero is implemented with React Three Fiber + Drei.
- The contact form is functional: a Server Action validates every field server-side, rate limits per IP, screens a honeypot, and delivers the lead. Delivery is pluggable — set `CONTACT_WEBHOOK_URL` (any webhook/CRM) or `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (email) to go live; see `.env.example`. With nothing configured it runs in local prototype mode: leads are logged and appended to `.data/leads.jsonl`, and the confirmation panel says so.
- Logo artwork is represented as a lightweight responsive recreation using the supplied brand palette; replace with the official vector logo asset when provided.
- Add real project photography/case-study metrics only when approved for publication.
