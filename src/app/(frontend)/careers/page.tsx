import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, ButtonLink, MediaImage, Section } from "@/components/ui/primitives";
import { getOpenJobs } from "@/lib/payload";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the team running the world's first flax straw multi-processing facility in Weyburn, Saskatchewan.",
  alternates: { canonical: "/careers" },
};

const typeLabel: Record<string, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  seasonal: "Seasonal",
};

export default async function CareersPage() {
  const jobs = await getOpenJobs();
  return (
    <>
      <section aria-labelledby="careers-h" className="container-wide grid items-center gap-12 py-section-sm lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Company" }, { label: "Careers" }]} />
          <h1 id="careers-h" className="text-4xl font-extrabold">
            Help run the first plant of its kind
          </h1>
          <p className="max-w-prose text-lg text-fg-muted">
            Our Weyburn facility is the only one in the world that turns flax straw into both fibre and pellets. We&apos;re
            growing to more than 30 full-time roles.
          </p>
          <div>
            <ButtonLink href="#roles">See open roles</ButtonLink>
          </div>
        </div>
        <MediaImage placeholder="an operator on the production floor" className="aspect-[5/4] rounded-xl" />
      </section>

      <Section id="roles" tone="tinted" labelledBy="roles-h">
        <h2 id="roles-h" className="mb-8 text-3xl">
          Open roles <span className="font-semibold text-fg-muted">({jobs.length})</span>
        </h2>
        {jobs.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {jobs.map((j) => (
              <li key={j.id}>
                <Link
                  href={`/careers/${j.slug}`}
                  className="pressable flex flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border border-border bg-surface px-7 py-6 no-underline hover:border-primary"
                >
                  <span className="flex min-w-0 flex-[1_1_22rem] flex-col gap-1">
                    <span className="font-display text-2xl font-bold">{j.title}</span>
                    <span className="text-base text-fg-muted">{j.summary}</span>
                  </span>
                  <span className="flex flex-wrap gap-2 text-[15px] font-semibold">
                    <span className="rounded-full bg-surface-sunken px-3 py-1.5">{j.location}</span>
                    <span className="rounded-full bg-surface-sunken px-3 py-1.5">{typeLabel[j.employmentType]}</span>
                    {j.shift ? <span className="rounded-full bg-surface-sunken px-3 py-1.5">{j.shift}</span> : null}
                  </span>
                  <span className="font-display font-semibold text-link">
                    View role <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg">There are no open roles right now. New positions are posted here as production grows.</p>
        )}
        <p className="mt-6 text-fg-muted">
          Follow us on{" "}
          <a href="https://ca.linkedin.com/company/prairie-clean" className="link">
            LinkedIn
          </a>{" "}
          to hear about new roles first.
        </p>
      </Section>
    </>
  );
}
