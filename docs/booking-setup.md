# Booking form setup

How the **Book a Session** page (`/book`) stores requests and emails the
clinic, and what to set up so it works locally and on Vercel
(caresseclinic.com).

- **Database:** Neon Postgres (free plan), created through Vercel, Frankfurt region.
- **Email:** Resend (free plan), sending from `bookings@caresseclinic.com` to `caresseclinic@gmail.com`.
- **Code:** `app/book/` (page and server action), `components/booking/BookingForm.tsx`, `lib/booking/` (validation, spam protection, email), `lib/db.ts`, `prisma/`.

## 1. Create the database (Neon via Vercel)

1. Open the caresseclinic.com project on [vercel.com](https://vercel.com) → **Storage** → **Create Database** → **Neon** (Serverless Postgres).
2. Choose the **Free** plan and the region **AWS Europe Central 1 (Frankfurt)**.
3. Connect it to the project for **Development, Preview and Production**.
4. In the integration settings, turn on **creating a database branch for Preview deployments**. Previews then get their own copy of the database, and test bookings never land in the real one.
5. Vercel adds `DATABASE_URL` (pooled, used by the app) and `DATABASE_URL_UNPOOLED` (direct, used by migrations) to the project automatically.
6. Recommended: in Vercel → **Settings → Functions**, set the function region to **Frankfurt (fra1)**, so the code runs next to the database.

**For local development:** in the Neon console, create a branch called `dev` from `main`. Copy its two connection strings into your local `.env` (see `.env.example`). Never use the production connection strings locally.

## 2. Set up email (Resend + Cloudflare DNS)

1. Create an account at [resend.com](https://resend.com).
2. **Domains → Add Domain** → `caresseclinic.com`, region **Ireland (eu-west-1)**.
3. Resend shows 3–4 DNS records (MX and TXT for `send`, TXT for `resend._domainkey`, and optionally `_dmarc`). Add each one in **Cloudflare → caresseclinic.com → DNS → Records** exactly as shown:
   - **Type, Name and Content:** copy them from Resend. Cloudflare adds `.caresseclinic.com` to the name itself.
   - **Priority:** for the MX record, use the value Resend gives (usually 10).
   - **Proxy status:** **DNS only** (grey cloud) for every record.
   - **Existing records:** if a TXT record for `_dmarc` already exists, keep it and don't add a second one.
4. Back in Resend, click **Verify**. It can take a few minutes up to a few hours.
5. **API Keys → Create API Key**: permission **Sending access**, domain `caresseclinic.com`. Copy the key; it's shown once.

## 3. Environment variables

Set these in Vercel → **Settings → Environment Variables** (Production and Preview), and in your local `.env`:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Added by the Neon integration (pooled connection) |
| `DATABASE_URL_UNPOOLED` | Added by the Neon integration (direct connection, for migrations) |
| `RESEND_API_KEY` | The Resend API key from step 2 |
| `BOOKING_EMAIL_TO` | `caresseclinic@gmail.com` |
| `BOOKING_EMAIL_FROM` | `Caresse Bookings <bookings@caresseclinic.com>` |
| `RATE_LIMIT_SALT` | A long random string. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

`.env` is git-ignored. Never commit it or paste its values into issues or chats.

If `RESEND_API_KEY`, `BOOKING_EMAIL_TO` or `BOOKING_EMAIL_FROM` is missing, the request is still saved and only the email is skipped (logged as `booking.email_skipped`).

## 4. Database migrations

- **Production and Preview:** Vercel runs `npm run vercel-build`, which applies migrations (`prisma migrate deploy`) before building.
- **Local:** after filling in `.env`, run `npm run db:deploy` to create the tables in your `dev` branch.
- **Schema changes:** edit `prisma/schema.prisma`, run `npm run db:migrate` locally (it creates a new migration), and commit the migration folder.

## 5. How a submission is handled

1. **Spam checks**, invisible to real people: a hidden honeypot field, and a minimum of 3 seconds between showing the form and submitting it. Bots get the normal "thank you" and nothing is saved.
2. **Validation** with zod, on the server. All errors are returned at once and the form keeps what was typed.
3. **Rate limits:**
   - **Per device:** 5 requests per hour per IP. The IP is stored only as a salted hash and deleted after 24 hours.
   - **Per phone number:** 3 requests per day.
4. **Save** to `AppointmentRequest`, with status `NEW` and the consent time.
5. **Email the clinic.** If sending fails, the person still sees success (the request is saved) and the log shows `booking.email_failed requestId=…`.

## Privacy

- Notes and the child's details can contain health information. They are stored only in `AppointmentRequest` and sent only in the clinic email (see `CLAUDE.md`, Privacy).
- Logs contain only request IDs and error codes, never submitted values.
- Delete old requests when they are no longer needed.

### TODO when the admin panel exists

The clinic email currently contains the **full request**, including notes and the child's details, because there is no admin panel yet. Once the admin panel exists, switch to a **short email**: who it's for, name, phone, form language, service, time slot and a link to the request. The details then stay only in the database. The code is marked `TODO(admin-panel)` in `lib/booking/email.ts`.
