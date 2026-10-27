"use client";

import { useState } from "react";
import { MediaImage } from "@/components/ui/primitives";
import type { Media } from "@/payload-types";

export type NewsCard = {
  id: number;
  title: string;
  href: string;
  external: boolean;
  source: string;
  date: string;
  topic: string;
  topicLabel: string;
  excerpt: string;
  image?: number | Media | null;
};

const topics = [
  { value: "all", label: "All" },
  { value: "products", label: "Products" },
  { value: "facility", label: "Facility" },
  { value: "farmers", label: "Farmers" },
  { value: "research", label: "Research" },
  { value: "funding", label: "Funding" },
];

export function NewsFilter({ items }: { items: NewsCard[] }) {
  const [topic, setTopic] = useState("all");
  const shown = topic === "all" ? items : items.filter((n) => n.topic === topic);
  return (
    <>
      <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={topic === t.value}
            onClick={() => setTopic(t.value)}
            className="pressable min-h-11 rounded-full border border-border bg-surface px-4 font-display text-[15px] font-semibold aria-pressed:border-inverse aria-pressed:bg-inverse aria-pressed:text-on-inverse"
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "story" : "stories"}
      </p>
      <ul className="border-t border-border">
        {shown.map((n) => (
          <li key={n.id} className="grid gap-x-8 gap-y-4 border-b border-border py-6 sm:grid-cols-[15rem_minmax(0,1fr)]">
            <MediaImage
              media={n.image}
              placeholder={n.title}
              className="aspect-[16/10] rounded-lg"
              sizes="(min-width: 640px) 240px, 100vw"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] text-fg-muted">
                <span className="font-display font-bold text-fg">{n.date}</span> · {n.source}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-accent">{n.topicLabel}</span>
              <a href={n.href} className="title-small font-display font-bold leading-snug no-underline hover:text-link">
                {n.title}
                {n.external ? <span className="sr-only"> (on {n.source})</span> : null}
              </a>
              <p className="text-base text-fg-muted">{n.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
