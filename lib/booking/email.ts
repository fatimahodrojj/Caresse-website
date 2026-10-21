import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import type { BookingInput } from "@/lib/booking/schema";
import { SITE_URL } from "@/lib/seo";

// Emails the clinic when a new booking request arrives, via Resend. Short on
// purpose: name, phone, service and a link to the request in the admin
// panel. Notes and the child's details (health information) are never
// emailed; they stay in the database. Always in English (messages/en.json,
// ClinicEmail).

export type ClinicEmailResult = "sent" | "skipped" | "failed";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type EmailRequest = Pick<BookingInput, "firstName" | "lastName" | "phone" | "service"> & { id: string };

/**
 * Sends the clinic email. Never throws and never logs the request contents;
 * the caller logs only the request ID if this fails.
 */
export async function sendClinicEmail(request: EmailRequest): Promise<ClinicEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO;
  const from = process.env.BOOKING_EMAIL_FROM;
  if (!apiKey || !to || !from) return "skipped";

  const t = await getTranslations({ locale: "en", namespace: "ClinicEmail" });
  const tTherapies = await getTranslations({ locale: "en", namespace: "Therapies" });
  const service = tTherapies(request.service);
  const link = `${SITE_URL}/admin/requests/${request.id}`;
  const rows: [string, string][] = [
    [t("name"), `${request.firstName} ${request.lastName}`],
    [t("phone"), request.phone],
    [t("service"), service],
  ];

  const subject = t("subject", { service });
  const text = [t("intro"), "", ...rows.map(([label, value]) => `${label}: ${value}`), "", `${t("open")}: ${link}`].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #2A3B4D; font-size: 15px; line-height: 1.5;">
      <p>${escapeHtml(t("intro"))}</p>
      <table cellpadding="6" style="border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="font-weight: bold; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p><a href="${escapeHtml(link)}" style="display: inline-block; background: #2A3B4D; color: #ffffff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: bold;">${escapeHtml(t("open"))}</a></p>
    </div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to, subject, text, html });
    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}
