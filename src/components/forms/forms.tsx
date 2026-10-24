"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import {
  submitApplication,
  submitContact,
  submitInvestorRequest,
  submitStrawOffer,
  type FormState,
} from "@/app/(frontend)/actions";
import {
  Checkbox,
  ConsentCheckbox,
  FormStatus,
  Honeypot,
  SelectField,
  SubmitButton,
  SuccessPanel,
  TextArea,
  TextField,
  provinces,
} from "./fields";

const initial: FormState = { status: "idle" };

/**
 * Submits through the server action without React's automatic form reset,
 * so people keep what they typed when a field needs fixing.
 */
function useFormAction(fn: (prev: FormState, fd: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(fn, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return [state, onSubmit, pending] as const;
}
const errorsOf = (s: FormState) => (s.status === "error" ? s.fieldErrors : undefined);
const formClass = "relative flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 sm:p-10";
const grid = "grid gap-5 sm:grid-cols-2";

export function ContactForm() {
  const [key, setKey] = useState(0);
  return <ContactFormInner key={key} onReset={() => setKey((k) => k + 1)} />;
}

const contactTopics = [
  { label: "General", value: "general" },
  { label: "Flax fibre", value: "flax_fibre" },
  { label: "Fuel pellets", value: "fuel_pellets" },
  { label: "Cat litter", value: "cat_litter" },
  { label: "Animal bedding", value: "animal_bedding" },
  { label: "Media", value: "media" },
];

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useFormAction(submitContact);
  if (state.status === "success") return <SuccessPanel message={state.message} onReset={onReset} />;
  const errors = errorsOf(state);
  return (
    <form onSubmit={action} className={formClass} noValidate>
      <Honeypot />
      <FormStatus state={state} />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-base font-semibold">
          What&apos;s it about? <span aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {contactTopics.map((t, i) => (
            <label
              key={t.value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-[15px] font-semibold has-[:checked]:border-primary has-[:checked]:bg-teal-50 dark:has-[:checked]:bg-teal-950"
            >
              <input type="radio" name="topic" value={t.value} defaultChecked={i === 0} className="size-4 accent-[var(--color-primary)]" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className={grid}>
        <TextField name="firstName" label="First name" required autoComplete="given-name" errors={errors} />
        <TextField name="lastName" label="Last name" autoComplete="family-name" errors={errors} />
        <TextField name="email" label="Email" type="email" required autoComplete="email" errors={errors} />
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" errors={errors} />
      </div>
      <TextArea name="message" label="Message" required rows={5} errors={errors} />
      <ConsentCheckbox errors={errors} />
      <SubmitButton pending={pending}>Send message</SubmitButton>
    </form>
  );
}

export function StrawOfferForm() {
  const [key, setKey] = useState(0);
  return <StrawOfferInner key={key} onReset={() => setKey((k) => k + 1)} />;
}

const interests = [
  { value: "sell", label: "Sell straw this year", hint: "I have flax straw baled or ready to bale" },
  { value: "rofr", label: "Sign a 5-year ROFR", hint: "I may grow flax in coming years" },
  { value: "info", label: "Just get information", hint: "I'm not ready to commit yet" },
];

function StrawOfferInner({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useFormAction(submitStrawOffer);
  const [interest, setInterest] = useState("sell");
  if (state.status === "success") return <SuccessPanel message={state.message} onReset={onReset} />;
  const errors = errorsOf(state);
  const year = new Date().getFullYear();
  return (
    <form onSubmit={action} className={formClass} noValidate>
      <Honeypot />
      <FormStatus state={state} />
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-display text-xl font-bold">
          What would you like to do? <span aria-hidden="true">*</span>
        </legend>
        <div className="grid gap-3 md:grid-cols-3">
          {interests.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 has-[:checked]:border-2 has-[:checked]:border-primary has-[:checked]:bg-teal-50 dark:has-[:checked]:bg-teal-950"
            >
              <input
                type="radio"
                name="interest"
                value={o.value}
                checked={interest === o.value}
                onChange={() => setInterest(o.value)}
                className="mt-1 size-5 accent-[var(--color-primary)]"
              />
              <span className="flex flex-col">
                <span className="font-bold">{o.label}</span>
                <span className="text-[15px] text-fg-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-3 font-display text-xl font-bold">About you</legend>
        <div className={grid}>
          <TextField name="fullName" label="Full name" required autoComplete="name" errors={errors} />
          <TextField name="farmName" label="Farm name" autoComplete="organization" errors={errors} />
          <TextField name="email" label="Email" type="email" required autoComplete="email" errors={errors} />
          <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" errors={errors} />
          <SelectField name="province" label="Province" options={provinces} required errors={errors} defaultValue="SK" />
          <TextField name="nearestTown" label="Nearest town" required errors={errors} />
          <TextField name="ruralMunicipality" label="Rural municipality" errors={errors} />
          <TextField name="legalLandLocation" label="Legal land location" placeholder="e.g. NE-12-08-14-W2" errors={errors} />
        </div>
      </fieldset>

      {interest === "sell" ? (
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-3 font-display text-xl font-bold">Your straw</legend>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField
              name="cropYear"
              label="Crop year"
              required
              errors={errors}
              defaultValue={String(year)}
              options={[year, year - 1].map((y) => ({ label: String(y), value: String(y) }))}
            />
            <TextField name="estimatedBales" label="Estimated bales" type="number" inputMode="numeric" min={1} required errors={errors} />
            <SelectField
              name="baleType"
              label="Bale type"
              required
              errors={errors}
              options={[
                { label: "Round", value: "round" },
                { label: "Large square", value: "large_square" },
              ]}
            />
            <TextField name="avgBaleWeightLb" label="Average bale weight (lb)" type="number" inputMode="numeric" min={1} errors={errors} />
            <TextField name="moisturePct" label="Moisture (%)" type="number" inputMode="decimal" min={0} max={100} step={0.5} errors={errors} />
            <SelectField
              name="canTransport"
              label="Can you haul to Weyburn?"
              errors={errors}
              defaultValue="no"
              options={[
                { label: "No, please arrange pickup", value: "no" },
                { label: "Yes, I can deliver", value: "yes" },
              ]}
            />
          </div>
          <Checkbox name="rockFree" errors={errors}>
            My bales are rock free
          </Checkbox>
        </fieldset>
      ) : null}

      <TextArea name="message" label="Anything else we should know?" errors={errors} />
      <ConsentCheckbox errors={errors} />
      <SubmitButton pending={pending}>{interest === "sell" ? "Send my straw offer" : "Send"}</SubmitButton>
    </form>
  );
}

export function InvestorForm() {
  const [state, action, pending] = useFormAction(submitInvestorRequest);
  if (state.status === "success") return <SuccessPanel message={state.message} />;
  const errors = errorsOf(state);
  return (
    <form onSubmit={action} className={formClass} noValidate>
      <Honeypot />
      <FormStatus state={state} />
      <div className={grid}>
        <TextField name="fullName" label="Full name" required autoComplete="name" errors={errors} />
        <TextField name="email" label="Email" type="email" required autoComplete="email" errors={errors} />
        <TextField name="phone" label="Phone" type="tel" autoComplete="tel" errors={errors} />
        <SelectField name="province" label="Province" options={provinces} required errors={errors} defaultValue="SK" />
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-base font-semibold">
          Are you an accredited investor? <span aria-hidden="true">*</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {[
            ["yes", "Yes"],
            ["no", "No"],
            ["unsure", "Not sure"],
          ].map(([value, label]) => (
            <label key={value} className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border border-border-strong px-4">
              <input type="radio" name="accredited" value={value} className="size-5 accent-[var(--color-primary)]" />
              {label}
            </label>
          ))}
        </div>
        {errors?.accredited ? <p className="text-sm font-semibold text-danger">{errors.accredited}</p> : null}
        <details className="text-base">
          <summary className="link cursor-pointer">What&apos;s an accredited investor?</summary>
          <p className="mt-2 text-fg-muted">
            Canadian securities rules set income, asset or professional thresholds that allow someone to invest in private
            companies. We&apos;ll walk you through them.
          </p>
        </details>
      </fieldset>
      <TextArea name="message" label="Message" rows={3} errors={errors} />
      <ConsentCheckbox errors={errors} />
      <SubmitButton pending={pending}>Request package</SubmitButton>
    </form>
  );
}

export function ApplicationForm({ jobId }: { jobId: number }) {
  const [state, action, pending] = useFormAction(submitApplication);
  if (state.status === "success") return <SuccessPanel message={state.message} />;
  const errors = errorsOf(state);
  return (
    <form onSubmit={action} className="relative flex flex-col gap-4" noValidate>
      <Honeypot />
      <input type="hidden" name="job" value={jobId} />
      <FormStatus state={state} />
      {errors?.form ? <p className="font-semibold text-danger">{errors.form}</p> : null}
      <TextField name="fullName" label="Full name" required autoComplete="name" errors={errors} />
      <TextField name="email" label="Email" type="email" required autoComplete="email" errors={errors} />
      <TextField name="phone" label="Phone" type="tel" required autoComplete="tel" errors={errors} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="resume" className="text-base font-semibold">
          Resume <span className="ml-1 text-sm font-normal text-fg-muted">PDF or Word, up to 4 MB</span>
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          aria-invalid={errors?.resume ? true : undefined}
          aria-describedby={errors?.resume ? "resume-error" : undefined}
          className="min-h-12 w-full min-w-0 rounded-md border border-dashed border-border-strong px-3.5 py-2.5"
        />
        {errors?.resume ? (
          <p id="resume-error" className="text-sm font-semibold text-danger">
            {errors.resume}
          </p>
        ) : null}
      </div>
      <TextArea name="coverNote" label="A few words about you" rows={3} errors={errors} />
      <ConsentCheckbox errors={errors} />
      <SubmitButton pending={pending}>Submit application</SubmitButton>
    </form>
  );
}
