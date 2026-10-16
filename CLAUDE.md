# CLAUDE.md
## Project
Caresse: website for a multitherapeutic clinic. Next.js (App Router), TypeScript, Tailwind CSS.
## Working rules
- Explain every change before making it, including WHY.
- Small, focused commits with conventional commit messages (feat:, fix:, chore:, docs:, refactor:).
- Never commit directly to main. One branch per feature (feature/..., chore/..., fix/...).
- Never print or commit secrets or .env values.
- Do not install new dependencies without explaining why and asking first.
- Prefer clear, simple code over clever code. TypeScript strict, no `any`.
## Privacy
- This project handles patient booking data. Store the minimum necessary.
- Health information (the appointment notes and a child's details) may be stored ONLY in appointment requests (the `AppointmentRequest` table). Never store it anywhere else.
- Never log health information or personal details: logs contain only request IDs and error codes. Never send it anywhere except the database and the clinic email.
- Keep appointment requests only as long as needed to handle them.
