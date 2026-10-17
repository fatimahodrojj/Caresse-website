import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthCard from "@/components/admin/AuthCard";
import { SetupForm } from "@/components/admin/AuthForms";
import { getDb } from "@/lib/db";

export const metadata: Metadata = { title: "Set up" };

// Checked on every visit, never cached.
export const dynamic = "force-dynamic";

/**
 * One-time creation of the first admin account. Only exists while
 * ADMIN_SETUP_TOKEN is set and there is no admin yet (then it is a 404).
 */
export default async function SetupPage() {
  if (!process.env.ADMIN_SETUP_TOKEN || (await getDb().adminUser.count()) > 0) notFound();
  return (
    <AuthCard title="Create the admin account" text="This page works once. After the account exists, it disappears.">
      <SetupForm />
    </AuthCard>
  );
}
