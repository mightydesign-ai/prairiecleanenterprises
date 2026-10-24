"use client";

import { useId, type ReactNode } from "react";
import type { FormState } from "@/app/(frontend)/actions";

const control =
  "min-h-12 w-full rounded-md border border-border-strong bg-surface px-3.5 text-base text-fg aria-[invalid=true]:border-danger";

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-semibold">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {hint ? <span className="ml-2 text-sm font-normal text-fg-muted">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, error?: string) => (error ? `${id}-error` : undefined);

export function TextField({
  name,
  label,
  type = "text",
  required,
  autoComplete,
  inputMode,
  hint,
  placeholder,
  errors,
  min,
  max,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "decimal" | "tel" | "email" | "text";
  hint?: string;
  placeholder?: string;
  errors?: Record<string, string>;
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useId();
  const error = errors?.[name];
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={control}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  options,
  required,
  errors,
  defaultValue,
}: {
  name: string;
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  errors?: Record<string, string>;
  defaultValue?: string;
}) {
  const id = useId();
  const error = errors?.[name];
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={control}
      >
        {defaultValue === undefined ? (
          <option value="" disabled>
            Choose…
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  required,
  rows = 4,
  errors,
}: {
  name: string;
  label: string;
  required?: boolean;
  rows?: number;
  errors?: Record<string, string>;
}) {
  const id = useId();
  const error = errors?.[name];
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={`${control} resize-y py-3`}
      />
    </FieldShell>
  );
}

export function Checkbox({
  name,
  children,
  required,
  errors,
}: {
  name: string;
  children: ReactNode;
  required?: boolean;
  errors?: Record<string, string>;
}) {
  const id = useId();
  const error = errors?.[name];
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-start gap-3 text-base">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error)}
          className="mt-1 size-5 shrink-0 accent-[var(--color-primary)]"
        />
        <span>
          {children}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ConsentCheckbox({ errors }: { errors?: Record<string, string> }) {
  return (
    <Checkbox name="consent" required errors={errors}>
      I&apos;ve read the{" "}
      <a href="/privacy" className="link">
        privacy statement
      </a>{" "}
      and agree PCE can contact me about this.
    </Checkbox>
  );
}

/** Hidden from people; bots tend to fill it. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (state.status !== "error") return null;
  return (
    <div role="alert" className="rounded-md border-2 border-danger bg-surface p-4 font-semibold text-danger">
      {state.message}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="pressable inline-flex min-h-12 items-center self-start rounded-md bg-primary px-7 font-display text-[17px] font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-70"
    >
      {pending ? "Sending…" : children}
    </button>
  );
}

export function SuccessPanel({ message, onReset }: { message: string; onReset?: () => void }) {
  return (
    <div role="status" className="flex flex-col gap-3 rounded-lg border-2 border-accent bg-surface p-7">
      <p className="font-display text-2xl font-bold">Thank you</p>
      <p className="text-fg-muted">{message}</p>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="pressable mt-2 inline-flex min-h-11 items-center self-start rounded-md border border-border-strong px-4 font-display font-semibold hover:bg-surface-sunken"
        >
          Send another
        </button>
      ) : null}
    </div>
  );
}

export const provinces = [
  { label: "Saskatchewan", value: "SK" },
  { label: "Manitoba", value: "MB" },
  { label: "Alberta", value: "AB" },
  { label: "British Columbia", value: "BC" },
  { label: "Ontario", value: "ON" },
  { label: "Quebec", value: "QC" },
  { label: "Atlantic Canada", value: "ATL" },
  { label: "Territories", value: "TERR" },
  { label: "United States", value: "US" },
  { label: "Outside North America", value: "INTL" },
];
