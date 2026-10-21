import type { PrismaClient } from "@/lib/generated/prisma/client";
import { getClinicSettings } from "@/lib/settings";

/**
 * Permanently deletes handled requests (contacted, approved or declined)
 * received more than the retention period ago (Settings, default 12 months).
 * New requests are never deleted automatically. Runs when the admin opens the
 * requests list and after each new booking.
 */
export async function cleanupOldRequests(db: PrismaClient): Promise<number> {
  const { retentionMonths } = await getClinicSettings();
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - retentionMonths);
  const { count } = await db.appointmentRequest.deleteMany({
    where: { status: { in: ["CONTACTED", "APPROVED", "DECLINED"] }, createdAt: { lt: cutoff } },
  });
  return count;
}
