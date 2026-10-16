import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import type { BookingInput } from "@/lib/booking/schema";

// Emails each new booking request to the clinic via Resend. The email is
// always in English (labels from messages/en.json, ClinicEmail).
//
// TODO(admin-panel): this email contains the full request, including notes
// and the child's details (health information), because there is no admin
// panel yet. Once the admin panel exists, switch to a short email (who it's
// for, name, phone, service, time slot and a link to the request) and keep
// the details only in the database. See docs/booking-setup.md.

export type ClinicEmailResult = "sent" | "skipped" | "failed";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBeirutTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Beirut",
  }).format(date);
}

async function emailRows(
  request: BookingInput & { id: string; createdAt: Date },
): Promise<[string, string][]> {
  const t = await getTranslations({ locale: "en", namespace: "ClinicEmail" });
  const tForm = await getTranslations({ locale: "en", namespace: "BookingForm" });
  const tTherapies = await getTranslations({ locale: "en", namespace: "Therapies" });
  const forChild = request.appointmentFor === "CHILD";
  const rows: [string, string][] = [
    [t("for"), tForm(`appointmentFor.${request.appointmentFor}`)],
    [forChild ? t("parentName") : t("name"), `${request.firstName} ${request.lastName}`],
    [t("phone"), request.phone],
  ];
  if (forChild) {
    rows.push([t("childFirstName"), request.childFirstName ?? ""]);
    rows.push([t("childAge"), String(request.childAge ?? "")]);
  }
  rows.push(
    [t("service"), tTherapies(request.service)],
    [t("preferredTime"), tForm(`timeSlots.${request.timeSlot}`)],
    [t("notes"), request.notes ?? t("notesNone")],
    [t("received"), t("beirutTime", { time: formatBeirutTime(request.createdAt) })],
    [t("requestId"), request.id],
  );
  return rows;
}

/**
 * Sends the clinic email. Never throws and never logs the request contents;
 * the caller logs only the request ID if this fails.
 */
export async function sendClinicEmail(
  request: BookingInput & { id: string; createdAt: Date },
): Promise<ClinicEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_EMAIL_TO;
  const from = process.env.BOOKING_EMAIL_FROM;
  if (!apiKey || !to || !from) return "skipped";

  // Labels and the email body are in English for the clinic.
  const t = await getTranslations({ locale: "en", namespace: "ClinicEmail" });
  const tTherapies = await getTranslations({ locale: "en", namespace: "Therapies" });
  const rows = await emailRows(request);
  const subject = t("subject", { service: tTherapies(request.service) });
  const text = [
    t("intro"),
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #2A3B4D; font-size: 15px; line-height: 1.5;">
      <p>${escapeHtml(t("intro"))}</p>
      <table cellpadding="6" style="border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="font-weight: bold; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td><td style="white-space: pre-wrap;">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
    </div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to, subject, text, html });
    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}
