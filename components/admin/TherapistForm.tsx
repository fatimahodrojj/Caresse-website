"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageField, SubmitButton, TextArea, TextField, Toggle } from "@/components/admin/forms";
import { useAdminForm } from "@/components/admin/useAdminForm";
import { saveTherapist } from "@/lib/admin/actions/therapists";
import { CHARACTER_OPTIONS } from "@/lib/characters";

export type TherapistFormValues = {
  id: string;
  nameEn: string;
  nameAr: string;
  roleEn: string;
  roleAr: string;
  credentialEn: string;
  credentialAr: string;
  experienceEn: string;
  experienceAr: string;
  expertiseEn: string[];
  expertiseAr: string[];
  bioEn: string;
  bioAr: string;
  photoUrl: string;
  character: string | null;
  accent: "SKY" | "PINK" | "PURPLE";
  visible: boolean;
};

const ACCENTS = [
  { value: "SKY", label: "Blue", swatch: "bg-sky" },
  { value: "PINK", label: "Pink", swatch: "bg-pink" },
  { value: "PURPLE", label: "Purple", swatch: "bg-purple" },
] as const;

function Section({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-card border border-line bg-white p-4 md:p-6">
      <legend className="sr-only">{title}</legend>
      <div className="flex flex-col gap-1">
        <h2 aria-hidden="true" className="text-lg font-bold">
          {title}
        </h2>
        {text && <p className="text-[13px] opacity-70">{text}</p>}
      </div>
      {children}
    </fieldset>
  );
}

/** English and Arabic versions of one field, side by side from tablet up. */
function Pair({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

export default function TherapistForm({ therapist }: { therapist?: TherapistFormValues }) {
  const router = useRouter();
  const { pending, onSubmit, errors } = useAdminForm(saveTherapist, () => router.refresh());
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {therapist && <input type="hidden" name="id" value={therapist.id} />}

      <Section title="Photo" text="A clear head-and-shoulders photo works best. It is shown in a circle.">
        <ImageField name="photo" label="Photo" currentUrl={therapist?.photoUrl} error={errors.photo} required round />
      </Section>

      <Section title="Name and role" text="Shown on the homepage and on the Our Team page.">
        <Pair>
          <TextField name="nameEn" label="Name (English)" defaultValue={therapist?.nameEn} error={errors.nameEn} required />
          <TextField name="nameAr" label="Name (Arabic)" dir="rtl" defaultValue={therapist?.nameAr} error={errors.nameAr} required />
        </Pair>
        <Pair>
          <TextField name="roleEn" label="Role (English)" defaultValue={therapist?.roleEn} error={errors.roleEn} hint="Separate several roles with |" required />
          <TextField name="roleAr" label="Role (Arabic)" dir="rtl" defaultValue={therapist?.roleAr} error={errors.roleAr} required />
        </Pair>
      </Section>

      <Section title="Profile" text="Shown on the Our Team page.">
        <Pair>
          <TextField name="credentialEn" label="Qualification (English)" defaultValue={therapist?.credentialEn} error={errors.credentialEn} hint="Optional" />
          <TextField name="credentialAr" label="Qualification (Arabic)" dir="rtl" defaultValue={therapist?.credentialAr} error={errors.credentialAr} />
        </Pair>
        <Pair>
          <TextField name="experienceEn" label="Experience (English)" defaultValue={therapist?.experienceEn} error={errors.experienceEn} hint="Optional, e.g. 6+ years in…" />
          <TextField name="experienceAr" label="Experience (Arabic)" dir="rtl" defaultValue={therapist?.experienceAr} error={errors.experienceAr} />
        </Pair>
        <Pair>
          <TextArea
            name="expertiseEn"
            label="Areas of expertise (English)"
            rows={4}
            defaultValue={therapist?.expertiseEn.join("\n")}
            error={errors.expertiseEn}
            hint="One per line."
          />
          <TextArea
            name="expertiseAr"
            label="Areas of expertise (Arabic)"
            rows={4}
            dir="rtl"
            defaultValue={therapist?.expertiseAr.join("\n")}
            error={errors.expertiseAr}
            hint="One per line."
          />
        </Pair>
        <Pair>
          <TextArea name="bioEn" label="About (English)" rows={7} defaultValue={therapist?.bioEn} error={errors.bioEn} />
          <TextArea name="bioAr" label="About (Arabic)" rows={7} dir="rtl" defaultValue={therapist?.bioAr} error={errors.bioAr} />
        </Pair>
      </Section>

      <Section title="Look" text="The small character under the homepage card, and the profile colour.">
        <div role="radiogroup" aria-label="Character" className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          <label className="flex cursor-pointer flex-col items-center gap-1">
            <input type="radio" name="character" value="" defaultChecked={!therapist?.character} className="peer sr-only" />
            <span className="flex size-14 items-center justify-center rounded-full border-2 border-line bg-cream text-[12px] font-bold opacity-80 peer-checked:border-sky peer-checked:ring-2 peer-checked:ring-sky/30 peer-focus-visible:ring-2 peer-focus-visible:ring-sky">
              None
            </span>
          </label>
          {CHARACTER_OPTIONS.map((src) => (
            <label key={src} className="flex cursor-pointer flex-col items-center gap-1">
              <input
                type="radio"
                name="character"
                value={src}
                defaultChecked={therapist?.character === src || (!therapist && src === CHARACTER_OPTIONS[0])}
                className="peer sr-only"
                aria-label={src.split("/").pop()?.replace(".png", "").replace(/-/g, " ")}
              />
              <Image
                src={src}
                alt=""
                width={56}
                height={56}
                className="size-14 rounded-full border-2 border-line object-cover peer-checked:border-sky peer-checked:ring-2 peer-checked:ring-sky/30 peer-focus-visible:ring-2 peer-focus-visible:ring-sky"
              />
            </label>
          ))}
        </div>
        {errors.character && <p className="text-[13px] font-semibold text-danger">{errors.character}</p>}

        <div role="radiogroup" aria-label="Profile colour" className="flex flex-wrap gap-2">
          {ACCENTS.map((accent) => (
            <label key={accent.value} className="cursor-pointer">
              <input
                type="radio"
                name="accent"
                value={accent.value}
                defaultChecked={(therapist?.accent ?? "SKY") === accent.value}
                className="peer sr-only"
              />
              <span className="flex min-h-11 items-center gap-2 rounded-full border-2 border-line bg-white px-4 text-sm font-bold peer-checked:border-navy peer-focus-visible:ring-2 peer-focus-visible:ring-sky">
                <span aria-hidden="true" className={`size-4 rounded-full ${accent.swatch}`} />
                {accent.label}
              </span>
            </label>
          ))}
        </div>

        <Toggle name="visible" label="Show on the website" hint="Hidden therapists stay here but are not shown." defaultChecked={therapist?.visible ?? true} />
      </Section>

      {/* Sticky on phones so Save is always reachable above the tab bar. */}
      <div className="sticky bottom-[76px] z-30 -mx-4 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <SubmitButton pending={pending} pendingLabel="Saving…" className="w-full md:w-auto">
          {therapist ? "Save changes" : "Add therapist"}
        </SubmitButton>
      </div>
    </form>
  );
}
