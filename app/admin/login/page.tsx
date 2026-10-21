import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthCard from "@/components/admin/AuthCard";
import { LoginForm } from "@/components/admin/AuthForms";
import { getAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (await getAdmin()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <AuthCard title="Admin sign in" text="For the Caresse team only.">
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  );
}
