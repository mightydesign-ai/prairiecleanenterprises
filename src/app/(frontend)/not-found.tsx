import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-section" aria-labelledby="nf-heading">
      <p className="eyebrow">Page not found</p>
      <h1 id="nf-heading" className="mt-4 text-4xl">
        That page has moved or no longer exists
      </h1>
      <p className="mt-6 max-w-prose text-lg text-fg-muted">
        Our site was rebuilt in 2026. Try the main menu, or head back to the homepage.
      </p>
      <Link
        href="/"
        className="pressable mt-8 inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-display font-semibold text-on-primary hover:bg-primary-hover"
      >
        Go to the homepage
      </Link>
    </section>
  );
}
