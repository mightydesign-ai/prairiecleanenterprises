"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import type { CollectionSlug } from "payload";
import { getPayloadClient } from "@/lib/payload";

export type FormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors: Record<string, string> };

const MAX_PER_HOUR = 5;
const INBOXES: CollectionSlug[] = ["contact-submissions", "straw-offers", "investor-inquiries", "job-applications"];

// No form field needs more than this; it stops oversized payloads from being stored.
const MAX_FIELD = 5000;
const text = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD) : "";
};
/** A finite number inside [min, max], or undefined. */
const num = (fd: FormData, key: string, min = 0, max = 1_000_000) => {
  const v = text(fd, key);
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
};
const checked = (fd: FormData, key: string) => fd.get(key) === "on";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_RE = /^[0-9+()\-. ]{7,20}$/;

type Errors = Record<string, string>;

function requireFields(fd: FormData, fields: Record<string, string>, errors: Errors) {
  for (const [key, message] of Object.entries(fields)) {
    if (!text(fd, key)) errors[key] = message;
  }
}

function checkContact(fd: FormData, errors: Errors, phoneRequired: boolean) {
  const email = text(fd, "email");
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter an email address like name@example.com.";
  const phone = text(fd, "phone");
  if (!phone && phoneRequired) errors.phone = "Enter your phone number.";
  else if (phone && !PHONE_RE.test(phone)) errors.phone = "Enter a phone number with 7 to 20 digits.";
  if (!checked(fd, "consent")) errors.consent = "Confirm you have read the privacy statement.";
}

const failed = (fieldErrors: Errors): FormState => ({
  status: "error",
  message: "Please fix the highlighted fields.",
  fieldErrors,
});

/** Honeypot plus a per-IP hourly limit. Returns a state to show, or the IP hash to store. */
async function guard(fd: FormData): Promise<{ blocked: FormState } | { ipHash: string | null }> {
  // Bots fill every field; people never see this one.
  if (text(fd, "company_website")) {
    return { blocked: { status: "success", message: "Thanks, we've received your message." } };
  }
  const h = await headers();
  // On Vercel x-vercel-forwarded-for / x-real-ip are set by the platform and can't be spoofed by the client.
  const ip =
    h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "";
  const ipHash = ip
    ? createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).digest("hex")
    : null;
  if (!ipHash) return { ipHash };

  const payload = await getPayloadClient();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  let total = 0;
  for (const collection of INBOXES) {
    const { totalDocs } = await payload.count({
      collection,
      where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: since } }] },
      overrideAccess: true,
    });
    total += totalDocs;
  }
  if (total >= MAX_PER_HOUR) {
    return {
      blocked: {
        status: "error",
        message: "We've already received several messages from you. Please try again in an hour, or call us.",
        fieldErrors: {},
      },
    };
  }
  return { ipHash };
}

async function save(collection: CollectionSlug, data: Record<string, unknown>) {
  const payload = await getPayloadClient();
  await payload.create({ collection, data: data as never, overrideAccess: true });
}

const somethingWentWrong: FormState = {
  status: "error",
  message: "Something went wrong sending your form. Please try again, or email info@prairiecleanenterprises.com.",
  fieldErrors: {},
};

export async function submitContact(_prev: FormState, fd: FormData): Promise<FormState> {
  const errors: Errors = {};
  requireFields(fd, { firstName: "Enter your first name.", message: "Enter a message." }, errors);
  checkContact(fd, errors, false);
  if (Object.keys(errors).length) return failed(errors);

  const g = await guard(fd);
  if ("blocked" in g) return g.blocked;
  try {
    await save("contact-submissions", {
      firstName: text(fd, "firstName"),
      lastName: text(fd, "lastName") || undefined,
      email: text(fd, "email"),
      phone: text(fd, "phone") || undefined,
      topic: text(fd, "topic") || "general",
      message: text(fd, "message"),
      consentAt: new Date().toISOString(),
      ipHash: g.ipHash,
    });
    return { status: "success", message: "Thanks for reaching out. We'll reply by email." };
  } catch (err) {
    console.error("contact submission failed", err);
    return somethingWentWrong;
  }
}

export async function submitStrawOffer(_prev: FormState, fd: FormData): Promise<FormState> {
  const errors: Errors = {};
  const interest = text(fd, "interest");
  if (!["sell", "rofr", "info"].includes(interest)) errors.interest = "Choose what you'd like to do.";
  requireFields(
    fd,
    {
      fullName: "Enter your full name.",
      province: "Choose your province.",
      nearestTown: "Enter the nearest town.",
    },
    errors,
  );
  checkContact(fd, errors, true);
  if (interest === "sell") {
    requireFields(
      fd,
      { cropYear: "Choose the crop year.", estimatedBales: "Estimate how many bales.", baleType: "Choose a bale type." },
      errors,
    );
  }
  if (Object.keys(errors).length) return failed(errors);

  const g = await guard(fd);
  if ("blocked" in g) return g.blocked;
  try {
    await save("straw-offers", {
      interest,
      fullName: text(fd, "fullName"),
      farmName: text(fd, "farmName") || undefined,
      email: text(fd, "email"),
      phone: text(fd, "phone"),
      province: text(fd, "province"),
      nearestTown: text(fd, "nearestTown"),
      ruralMunicipality: text(fd, "ruralMunicipality") || undefined,
      legalLandLocation: text(fd, "legalLandLocation") || undefined,
      cropYear: interest === "sell" ? num(fd, "cropYear", 2000, 2100) : undefined,
      estimatedBales: interest === "sell" ? num(fd, "estimatedBales", 1, 1_000_000) : undefined,
      baleType: interest === "sell" ? text(fd, "baleType") || undefined : undefined,
      avgBaleWeightLb: num(fd, "avgBaleWeightLb", 1, 10_000),
      moisturePct: num(fd, "moisturePct", 0, 100),
      canTransport: text(fd, "canTransport") === "yes",
      rockFree: checked(fd, "rockFree"),
      message: text(fd, "message") || undefined,
      consentAt: new Date().toISOString(),
      ipHash: g.ipHash,
    });
    return {
      status: "success",
      message:
        "Thanks, your offer is in. We'll review it and email you. If you're in our purchasing area, your contract comes with that email.",
    };
  } catch (err) {
    console.error("straw offer failed", err);
    return somethingWentWrong;
  }
}

export async function submitInvestorRequest(_prev: FormState, fd: FormData): Promise<FormState> {
  const errors: Errors = {};
  requireFields(fd, { fullName: "Enter your full name.", province: "Choose your province." }, errors);
  if (!["yes", "no", "unsure"].includes(text(fd, "accredited"))) errors.accredited = "Tell us if you're an accredited investor.";
  checkContact(fd, errors, false);
  if (Object.keys(errors).length) return failed(errors);

  const g = await guard(fd);
  if ("blocked" in g) return g.blocked;
  try {
    await save("investor-inquiries", {
      fullName: text(fd, "fullName"),
      email: text(fd, "email"),
      phone: text(fd, "phone") || undefined,
      province: text(fd, "province"),
      accredited: text(fd, "accredited"),
      message: text(fd, "message") || undefined,
      consentAt: new Date().toISOString(),
      ipHash: g.ipHash,
    });
    return { status: "success", message: "Thanks, we've got your request. Our team will contact you to confirm your details." };
  } catch (err) {
    console.error("investor request failed", err);
    return somethingWentWrong;
  }
}

/** The browser-supplied file type can be faked, so also check the file's first bytes. */
function looksLikeResume(bytes: Buffer): boolean {
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  return (
    starts([0x25, 0x50, 0x44, 0x46, 0x2d]) || // %PDF-
    starts([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]) || // .doc (OLE)
    starts([0x50, 0x4b, 0x03, 0x04]) // .docx (zip)
  );
}

const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function submitApplication(_prev: FormState, fd: FormData): Promise<FormState> {
  const errors: Errors = {};
  requireFields(fd, { fullName: "Enter your full name." }, errors);
  checkContact(fd, errors, true);
  const jobId = num(fd, "job", 1, 2_147_483_647);
  if (!jobId) errors.form = "This posting is no longer open.";
  const resume = fd.get("resume");
  const hasResume = resume instanceof File && resume.size > 0;
  if (hasResume && resume.size > 4 * 1024 * 1024) errors.resume = "Resume must be 4 MB or smaller.";
  if (hasResume && !RESUME_TYPES.includes(resume.type)) errors.resume = "Upload a PDF or Word document.";
  let resumeBytes: Buffer | null = null;
  if (hasResume && !errors.resume) {
    resumeBytes = Buffer.from(await (resume as File).arrayBuffer());
    if (!looksLikeResume(resumeBytes)) errors.resume = "Upload a PDF or Word document.";
  }
  if (Object.keys(errors).length) return failed(errors);

  const g = await guard(fd);
  if ("blocked" in g) return g.blocked;
  try {
    const payload = await getPayloadClient();
    // Only accept applications for postings that are open to the public.
    const openJob = await payload.find({
      collection: "jobs",
      where: { and: [{ id: { equals: jobId } }, { open: { equals: true } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (openJob.totalDocs === 0) return failed({ form: "This posting is no longer open." });
    let resumeId: number | undefined;
    if (hasResume && resumeBytes) {
      const file = resume as File;
      const doc = await payload.create({
        collection: "resumes",
        data: {},
        file: {
          data: resumeBytes,
          mimetype: file.type,
          name: file.name.replace(/[^\w.\-]+/g, "_"),
          size: file.size,
        },
        overrideAccess: true,
      });
      resumeId = doc.id;
    }
    await payload.create({
      collection: "job-applications",
      data: {
        job: jobId!,
        fullName: text(fd, "fullName"),
        email: text(fd, "email"),
        phone: text(fd, "phone"),
        resume: resumeId,
        coverNote: text(fd, "coverNote") || undefined,
        consentAt: new Date().toISOString(),
        ipHash: g.ipHash,
      },
      overrideAccess: true,
    });
    return { status: "success", message: "Application received. If your experience is a fit, we'll contact you about next steps." };
  } catch (err) {
    console.error("job application failed", err);
    return somethingWentWrong;
  }
}
