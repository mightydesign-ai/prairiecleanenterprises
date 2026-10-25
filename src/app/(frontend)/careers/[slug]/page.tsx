import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms/forms";
import { Breadcrumb } from "@/components/ui/primitives";
import { getJobBySlug, getOpenJobs } from "@/lib/payload";
import { site } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getOpenJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};
  return { title: `${job.title}, ${job.location}`, description: job.summary, alternates: { canonical: `/careers/${slug}` } };
}

const typeLabel: Record<string, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  seasonal: "Seasonal",
};
const schemaType: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  seasonal: "TEMPORARY",
};

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  // Lets the posting appear in Google's job search.
  const jobJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.postedOn,
    employmentType: schemaType[job.employmentType],
    hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location.split(",")[0]?.trim(), addressRegion: "SK", addressCountry: "CA" },
    },
  };

  return (
    <div className="container-wide py-section-sm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }} />
      <div className="mb-10 flex flex-col gap-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }, { label: job.title }]} />
        <h1 className="text-4xl font-extrabold">{job.title}</h1>
        <ul aria-label="Role details" className="flex flex-wrap gap-2 text-[15px] font-semibold">
          {[job.location, typeLabel[job.employmentType], job.shift, job.pay].filter(Boolean).map((t) => (
            <li key={t} className="rounded-full bg-surface-sunken px-3.5 py-1.5">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-start gap-12">
        <article className="flex min-w-0 flex-[999_1_34rem] flex-col gap-10">
          <section aria-labelledby="role-h" className="flex flex-col gap-3">
            <h2 id="role-h" className="text-2xl">
              The role
            </h2>
            <p>{job.summary}</p>
            {job.about ? (
              <div className="prose-pce flex flex-col gap-4">
                <RichText data={job.about as never} />
              </div>
            ) : null}
          </section>
          {job.responsibilities && job.responsibilities.length > 0 ? (
            <section aria-labelledby="resp-h" className="flex flex-col gap-4">
              <h2 id="resp-h" className="text-2xl">
                What you&apos;ll do
              </h2>
              <dl className="grid gap-3.5 md:grid-cols-2">
                {job.responsibilities.map((r) => (
                  <div key={r.id ?? r.title} className="rounded-lg border border-border bg-surface px-5 py-4">
                    <dt className="font-display font-bold">{r.title}</dt>
                    {r.text ? <dd className="mt-1 text-base text-fg-muted">{r.text}</dd> : null}
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {job.requirements && job.requirements.length > 0 ? (
            <section aria-labelledby="req-h" className="flex flex-col gap-3">
              <h2 id="req-h" className="text-2xl">
                What you need
              </h2>
              <ul className="list-disc space-y-1.5 pl-6">
                {job.requirements.map((r) => (
                  <li key={r.id ?? r.text}>{r.text}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside aria-labelledby="apply-h" className="flex min-w-0 flex-[1_1_20rem] flex-col gap-5 rounded-xl border border-border bg-surface p-5 shadow-raised sm:p-7">
          <h2 id="apply-h" className="text-2xl">
            Apply for this role
          </h2>
          <ApplicationForm jobId={job.id} />
        </aside>
      </div>
    </div>
  );
}
