"use client";

import Image from "next/image";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitBookingRequest, type BookingFormState } from "@/app/book/actions";
import {
  APPOINTMENT_FOR_OPTIONS,
  NOTES_MAX_LENGTH,
  SERVICE_OPTIONS,
  TIME_SLOT_OPTIONS,
} from "@/lib/booking/options";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/booking/spam-fields";
import type { BookingField } from "@/lib/booking/schema";

type Values = Record<Exclude<BookingField, "consent">, string> & { consent: boolean };

const EMPTY_VALUES: Values = {
  appointmentFor: "",
  childFirstName: "",
  childAge: "",
  firstName: "",
  lastName: "",
  phone: "",
  service: "",
  timeSlot: "",
  notes: "",
  consent: false,
};

// Order used to move focus to the first field with an error.
const FIELD_ORDER: BookingField[] = [
  "appointmentFor",
  "childFirstName",
  "childAge",
  "firstName",
  "lastName",
  "phone",
  "service",
  "timeSlot",
  "notes",
  "consent",
];

const inputClass =
  "h-11 w-full rounded-control border bg-white px-4 text-[15px] text-navy placeholder:text-navy/55 md:h-[52px]";

function borderFor(error: string | undefined) {
  return error ? "border-danger" : "border-navy/[0.12]";
}

/**
 * The "Request an Appointment" card (Figma 33:5 / 113:709) and its success
 * state. Values are kept in state so nothing typed is lost when the server
 * returns errors.
 */
export default function BookingForm() {
  const [state, formAction, isPending] = useActionState<BookingFormState, FormData>(
    submitBookingRequest,
    { status: "idle" },
  );
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};

  // When the form is shown (spam check: minimum fill time).
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  // After a submission: focus the first field with an error, the error
  // message, or the success heading.
  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
      return;
    }
    if (state.status !== "error") return;
    const first = FIELD_ORDER.find((field) => state.fieldErrors[field]);
    const target = first ? document.querySelector<HTMLElement>(`[data-field="${first}"]`) : null;
    (target ?? formErrorRef.current)?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-panel bg-white p-6 text-center drop-shadow-form md:gap-6 md:rounded-card md:p-12">
        <Characters size="small" />
        <div className="flex flex-col gap-2" aria-live="polite">
          <h2
            ref={successRef}
            tabIndex={-1}
            className="font-heading text-[28px] outline-none md:text-4xl"
          >
            Thank you!
          </h2>
          <p className="text-sm leading-[1.5] opacity-80 md:text-base">
            We&apos;ve received your request. Our team will contact you soon.
          </p>
        </div>
      </div>
    );
  }

  const forChild = values.appointmentFor === "CHILD";

  return (
    <div className="flex flex-col gap-3 rounded-panel bg-white p-4 drop-shadow-form md:gap-6 md:rounded-card md:p-8">
      <div className="flex flex-col gap-1 md:gap-2">
        <h2 className="font-heading text-[28px] md:text-4xl">Request an Appointment</h2>
        <p className="text-sm leading-[1.5] opacity-80 md:text-base">
          Please provide complete details so we can assist you better.
        </p>
      </div>

      {/* With JavaScript, onSubmit dispatches the action without React's automatic
          form reset (which would clear the radio, selects and checkbox after an
          error). Without JavaScript, the action attribute submits normally. */}
      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-[10px] md:gap-4"
      >
        {state.status === "error" && (
          <p
            ref={formErrorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-control bg-danger/10 px-4 py-3 text-sm font-semibold text-danger outline-none"
          >
            {state.formError}
          </p>
        )}

        {/* Spam protection: hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input ref={startedAtRef} type="hidden" name={STARTED_AT_FIELD} />

        <fieldset
          className="group flex flex-col gap-[6px] md:gap-2"
          aria-describedby={fieldErrors.appointmentFor ? "appointmentFor-error" : undefined}
        >
          <legend className="mb-[6px] text-sm font-semibold md:mb-2">
            Who is this appointment for?
          </legend>
          <div className="grid grid-cols-2 gap-[10px] md:gap-4">
            {APPOINTMENT_FOR_OPTIONS.map((option, index) => (
              <label
                key={option.value}
                className={`flex h-11 cursor-pointer items-center gap-3 rounded-control border bg-white px-4 text-[15px] has-[:checked]:border-pink has-[:checked]:bg-pink/[0.06] has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-navy md:h-[52px] ${borderFor(fieldErrors.appointmentFor)}`}
              >
                <input
                  type="radio"
                  name="appointmentFor"
                  value={option.value}
                  checked={values.appointmentFor === option.value}
                  onChange={() => update("appointmentFor", option.value)}
                  data-field={index === 0 ? "appointmentFor" : undefined}
                  className="size-4 shrink-0 accent-pink"
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError id="appointmentFor-error" message={fieldErrors.appointmentFor} />

          {/* Shown with CSS when "For my child" is selected, so it also works
              without JavaScript. */}
          <div className="mt-[4px] hidden flex-col gap-[10px] group-has-[input[value=CHILD]:checked]:flex md:mt-2 md:flex-row md:gap-4">
            <TextField
              field="childFirstName"
              label="Child's first name"
              value={values.childFirstName}
              onChange={(value) => update("childFirstName", value)}
              error={fieldErrors.childFirstName}
              required={forChild}
              autoComplete="off"
            />
            <TextField
              field="childAge"
              label="Child's age"
              value={values.childAge}
              onChange={(value) => update("childAge", value.replace(/\D/g, "").slice(0, 2))}
              error={fieldErrors.childAge}
              required={forChild}
              inputMode="numeric"
              placeholder="0–17"
              autoComplete="off"
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-[10px] md:flex-row md:gap-4">
          <TextField
            field="firstName"
            label="First Name"
            value={values.firstName}
            onChange={(value) => update("firstName", value)}
            error={fieldErrors.firstName}
            placeholder="e.g. Sarah"
            autoComplete="given-name"
            required
          />
          <TextField
            field="lastName"
            label="Last Name"
            value={values.lastName}
            onChange={(value) => update("lastName", value)}
            error={fieldErrors.lastName}
            placeholder="e.g. Mitchell"
            autoComplete="family-name"
            required
          />
        </div>

        <TextField
          field="phone"
          label="Phone Number"
          type="tel"
          value={values.phone}
          onChange={(value) => update("phone", value)}
          error={fieldErrors.phone}
          placeholder="+961 71 234 567"
          autoComplete="tel"
          required
        />

        <SelectField
          field="service"
          label="Preferred Service"
          placeholder="Select a therapy service"
          options={SERVICE_OPTIONS}
          value={values.service}
          onChange={(value) => update("service", value)}
          error={fieldErrors.service}
        />

        <SelectField
          field="timeSlot"
          label="Preferred Time Slot"
          placeholder="e.g. Morning, Afternoon"
          options={TIME_SLOT_OPTIONS}
          value={values.timeSlot}
          onChange={(value) => update("timeSlot", value)}
          error={fieldErrors.timeSlot}
        />

        <Field field="notes" label="Tell us about your needs or goals" error={fieldErrors.notes}>
          <textarea
            id="notes"
            name="notes"
            data-field="notes"
            value={values.notes}
            onChange={(event) => update("notes", event.target.value)}
            maxLength={NOTES_MAX_LENGTH}
            placeholder="Briefly tell us what you're looking for…"
            aria-invalid={fieldErrors.notes ? true : undefined}
            aria-describedby={fieldErrors.notes ? "notes-error" : undefined}
            className={`h-[120px] w-full resize-y rounded-control border bg-white px-4 py-3 text-[15px] leading-[1.5] text-navy placeholder:text-navy/55 md:h-[140px] md:py-[14px] ${borderFor(fieldErrors.notes)}`}
          />
        </Field>

        <div className="flex flex-col gap-[6px]">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-[1.5]">
            <input
              type="checkbox"
              name="consent"
              data-field="consent"
              checked={values.consent}
              onChange={(event) => update("consent", event.target.checked)}
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
              className="mt-[2px] size-5 shrink-0 accent-pink"
            />
            I agree that Caresse may store this information to contact me about my request.
          </label>
          <FieldError id="consent-error" message={fieldErrors.consent} />
        </div>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="mt-1 h-12 w-full rounded-full bg-pink text-[15px] font-bold text-white transition-opacity disabled:opacity-70 md:h-14 md:text-base"
        >
          {isPending ? "Sending…" : "Submit Appointment Request"}
        </button>
      </form>
    </div>
  );
}

function Field({
  field,
  label,
  error,
  children,
}: {
  field: BookingField;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[6px] md:gap-2">
      <label htmlFor={field} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <FieldError id={`${field}-error`} message={error} />
    </div>
  );
}

function TextField({
  field,
  label,
  value,
  onChange,
  error,
  type = "text",
  required,
  ...inputProps
}: {
  field: BookingField;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "tel";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "numeric";
}) {
  return (
    <Field field={field} label={label} error={error}>
      <input
        id={field}
        name={field}
        type={type}
        data-field={field}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${field}-error` : undefined}
        className={`${inputClass} ${borderFor(error)}`}
        {...inputProps}
      />
    </Field>
  );
}

function SelectField({
  field,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  field: BookingField;
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field field={field} label={label} error={error}>
      <div className="relative">
        <select
          id={field}
          name={field}
          data-field={field}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${field}-error` : undefined}
          className={`${inputClass} ${borderFor(error)} cursor-pointer appearance-none pr-12 ${value ? "" : "text-navy/55"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-navy">
              {option.label}
            </option>
          ))}
        </select>
        <Image
          src="/images/icons/chevron-down.svg"
          alt=""
          width={20}
          height={20}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </div>
    </Field>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-[13px] font-semibold text-danger">
      {message}
    </p>
  );
}

/** The three page characters (same images as the page header). */
export function Characters({ size }: { size: "small" | "large" }) {
  const sizes =
    size === "large"
      ? [
          "mr-[-18px] size-[90px] md:mr-[-30px] md:size-[120px]",
          "mr-[-18px] size-[110px] md:mr-[-30px] md:size-[140px]",
          "size-[85px] md:size-[110px]",
        ]
      : ["mr-[-14px] size-16 md:size-20", "mr-[-14px] size-[76px] md:size-24", "size-[60px] md:size-[76px]"];
  const images = [
    "/images/illustrations/book-character-blue.png",
    "/images/illustrations/book-character-pink.png",
    "/images/illustrations/book-character-gold.png",
  ];
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={280}
          height={280}
          priority={size === "large"}
          sizes={size === "large" ? "(min-width: 768px) 140px, 110px" : "96px"}
          className={`relative rounded-full object-cover ${sizes[index]}`}
        />
      ))}
    </div>
  );
}
