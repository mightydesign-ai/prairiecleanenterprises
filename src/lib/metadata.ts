import type { Metadata } from "next";
import type { Media } from "@/payload-types";

type Meta = { title?: string | null; description?: string | null; image?: number | Media | null } | null | undefined;

export function buildMetadata({
  title,
  description,
  meta,
  path,
}: {
  title: string;
  description?: string | null;
  meta?: Meta;
  path: string;
}): Metadata {
  const image = meta?.image && typeof meta.image === "object" ? meta.image : null;
  const desc = meta?.description || description || undefined;
  return {
    title: meta?.title || title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: meta?.title || title,
      description: desc,
      url: path,
      images: image?.url ? [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined }] : undefined,
    },
  };
}
