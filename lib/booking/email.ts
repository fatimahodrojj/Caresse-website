import { Resend } from "resend";
import {
  APPOINTMENT_FOR_OPTIONS,
  SERVICE_OPTIONS,
  TIME_SLOT_OPTIONS,
  labelFor,
} from "@/lib/booking/options";
import type { BookingInput } from "@/lib/booking/schema";

// Emails each new booking request to the clinic via Resend.
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

function emailRows(request: BookingInput & { id: string; createdAt: Date }): [string, string][] {
  const forChild = request.appointmentFor === "CHILD";
  const rows: [string, string][] = [
    ["For", labelFor(APPOINTMENT_FOR_OPTIONS, request.appointmentFor)],
    [forChild ? "Parent's name" : "Name", `${request.firstName} ${request.lastName}`],
    ["Phone", request.phone],
  ];
  if (forChild) {
    rows.push(["Child's first name", request.childFirstName ?? ""]);
    rows.push(["Child's age", String(request.childAge ?? "")]);
  }
  rows.push(
    ["Service", labelFor(SERVICE_OPTIONS, request.service)],
    ["Preferred time", labelFor(TIME_SLOT_OPTIONS, request.timeSlot)],
    ["Needs or goals", request.notes ?? "(none)"],
    ["Received", `${formatBeirutTime(request.createdAt)} (Beirut time)`],
    ["Request ID", request.id],
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

  const rows = emailRows(request);
  const subject = `New appointment request: ${labelFor(SERVICE_OPTIONS, request.service)}`;
  const text = [
    "A new appointment request was submitted on caresseclinic.com.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #2A3B4D; font-size: 15px; line-height: 1.5;">
      <p>A new appointment request was submitted on caresseclinic.com.</p>
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
