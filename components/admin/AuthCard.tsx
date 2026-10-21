import Image from "next/image";

/** Centered card for the sign-in and setup pages. */
export default function AuthCard({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-card border border-line bg-white p-6 drop-shadow-form md:p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/images/brand/logo.png" alt="Caresse" width={1080} height={391} className="h-12 w-auto" priority />
          <h1 className="font-heading text-[32px] leading-[1.1]">{title}</h1>
          {text && <p className="text-sm leading-[1.6] opacity-75">{text}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}
