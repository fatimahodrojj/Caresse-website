# Admin panel

The admin panel is at **caresseclinic.com/admin** (English only; `/ar/admin` goes to the same place). Nothing on the public site links to it, and search engines are told not to index it.

| Tab | What it does |
| --- | --- |
| **Requests** | Appointment requests from the Book a Session page. Filter by status, search by name or phone, call or WhatsApp, mark as contacted, approve, decline, delete permanently. The badge shows how many are new. |
| **Therapists** | The team on the homepage and the Our Team page: add, edit, hide, reorder, delete. |
| **Shop** | Products in "Our Therapy Shop" on the homepage: add, edit, hide, reorder, delete. There is no cart or checkout yet. |
| **Settings** | Phone, email, address, Instagram link (used in the footer and "Call Us"), how long handled requests are kept, and your password. |

Changes appear on the website right away.

## One-time setup

Do these in the Vercel project for caresseclinic.com.

### 1. Create the photo storage (Vercel Blob)

1. Vercel → the project → **Storage** → **Create Database** → **Blob**.
2. Name it `caresse-uploads`. If Vercel asks for a region, choose **Frankfurt (fra1)**, next to the database.
3. Connect it to the project for **Production, Preview and Development**.
4. Vercel adds the store's environment variables to the project automatically; there's nothing to copy. Newer stores add `BLOB_STORE_ID` (the site then signs in to Blob automatically on Vercel); older stores add `BLOB_READ_WRITE_TOKEN`. The site works with either one.
5. Redeploy (Deployments → the latest one → ⋯ → **Redeploy**) so the site picks up the new variable.

Photos are limited to JPG, PNG or WebP, up to 5 MB. The server checks the file, turns it upright, removes hidden metadata (such as GPS location), resizes it and saves it as WebP.

### 2. Add the setup token

1. Generate a long random secret on your computer:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Vercel → **Settings → Environment Variables** → add `ADMIN_SETUP_TOKEN` with that value, for **Production** (and Preview, if you want to try the panel on a preview first).
3. Redeploy.

Keep the value to yourself; don't paste it into chats or issues.

### 3. Create your admin account

1. Open **caresseclinic.com/admin/setup**.
2. Enter the setup token from step 2, your email, and a password of at least 12 characters (a short sentence is easy to remember and strong).
3. Press **Create admin account**. You are signed in and taken to Requests.

The setup page works once: as soon as an admin account exists, it shows "page not found". You can now delete `ADMIN_SETUP_TOKEN` from Vercel (recommended). If you ever need to create the first account again (for example on a fresh database), add it back.

## Security

- **Passwords** are stored only as argon2id hashes. They are never stored or logged in plain text, and the panel never displays them.
- **Sessions** use a random token in an httpOnly, Secure, SameSite=Lax cookie that expires after 7 days. The database stores only a hash of the token. Signing out deletes the session; changing your password signs out your other devices.
- **Sign-in protection:** after 5 failed attempts for one email (or 10 from one connection) within 15 minutes, sign-in is paused for 15 minutes. The message is always "Invalid email or password", so it doesn't reveal which emails exist.
- **Two layers of checks:** `proxy.ts` sends visitors without a session cookie to the sign-in page, and every admin page and every action checks the session again against the database.
- **Validation:** every action validates its input on the server (zod). Logs contain only request IDs and error codes, never notes, child details, emails or passwords.

## Requests and privacy

- **The clinic email is short:** name, phone, service and a link to the request in the admin panel. Notes and the child's details are only in the database and the admin panel.
- **Automatic cleanup:** contacted, approved and declined requests are deleted permanently once they are older than the period in Settings (12 months by default). New requests are never deleted automatically. The cleanup runs whenever someone opens Requests and after every new booking.
- **On request:** if a family asks to have their data removed, open their request and use **Delete permanently**.

## Local development (optional)

The site needs a Postgres database. Two options:

- **A Neon branch** (simplest): see docs/booking-setup.md.
- **A local Postgres:** run it with a WebSocket proxy in front, and set `NEON_LOCAL_WS_PROXY=localhost:<proxy port>` together with a local `DATABASE_URL`. This is Neon's documented local setup; never set this variable on Vercel.

Without `BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN`, photo uploads show "Photo uploads are not set up yet"; everything else works. (`BLOB_STORE_ID` only works on Vercel; locally, use a read-write token.)

Public and private Blob stores both work: photos in a private store are served through the site itself (`/media/...`).

If an upload fails (for example a storage problem), the admin shows "The photo could not be uploaded" and nothing is saved, so you can simply try again.
