"use client";

import { useEffect, useRef, useState } from "react";
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

const PAGE_SIZE = 10;

export function NewsFilter({ items }: { items: NewsCard[] }) {
  const [topic, setTopic] = useState("all");
  const [count, setCount] = useState(PAGE_SIZE);
  const listRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<number | null>(null);
  const matching = topic === "all" ? items : items.filter((n) => n.topic === topic);
  const shown = matching.slice(0, count);

  // After "Load more", move keyboard focus to the first story that was just added so it is not lost at the bottom.
  useEffect(() => {
    if (focusFrom.current == null) return;
    listRef.current?.querySelectorAll("li")[focusFrom.current]?.querySelector("a")?.focus();
    focusFrom.current = null;
  }, [count]);
  return (
    <>
      <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={topic === t.value}
            onClick={() => {
              setTopic(t.value);
              setCount(PAGE_SIZE);
            }}
            className="pressable min-h-11 rounded-full border border-border bg-surface px-4 font-display text-[15px] font-semibold aria-pressed:border-inverse aria-pressed:bg-inverse aria-pressed:text-on-inverse"
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} of {matching.length} {matching.length === 1 ? "story" : "stories"}
      </p>
      <ul ref={listRef} className="border-t border-border">
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
              <a href={n.href} className="title-small font-display leading-snug no-underline hover:text-link">
                {n.title}
                {n.external ? <span className="sr-only"> (on {n.source})</span> : null}
              </a>
              <p className="text-base text-fg-muted">{n.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
      {matching.length > count ? (
        <div className="flex flex-col items-center gap-3 pt-8">
          <p className="text-sm text-fg-muted">
            Showing {shown.length} of {matching.length} stories
          </p>
          <button
            type="button"
            onClick={() => {
              focusFrom.current = shown.length;
              setCount((c) => c + PAGE_SIZE);
            }}
            className="pressable inline-flex min-h-12 items-center justify-center rounded-md border border-border-strong px-6 font-display font-semibold hover:bg-surface-sunken"
          >
            Load more stories
          </button>
        </div>
      ) : null}
    </>
  );
}
