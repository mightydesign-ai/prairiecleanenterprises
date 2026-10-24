"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isGroup, type NavItem, type NavLink } from "@/lib/site";

/**
 * Mobile navigation in a native modal <dialog>: the browser traps focus,
 * makes the page behind it inert, closes on Escape and restores focus to
 * the Menu button. Every link is visible at once; no nested toggles.
 */
export function MobileNav({ items, cta }: { items: NavItem[]; cta: NavLink }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="pressable inline-flex min-h-11 items-center gap-2 rounded-md border border-border-strong px-4 font-display text-sm font-semibold text-fg hover:bg-surface-sunken"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
          <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        Menu
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === dialogRef.current) close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-bg p-0 text-fg backdrop:bg-neutral-950/50 backdrop:backdrop-blur-sm open:animate-fade-in"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-header items-center justify-between border-b border-border px-gutter">
            <span className="font-display text-sm font-semibold text-fg-muted">Menu</span>
            <button
              type="button"
              onClick={close}
              className="pressable inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-display text-sm font-semibold hover:bg-surface-sunken"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              Close
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-gutter py-6">
            <ul className="space-y-6">
              {items.map((item) =>
                isGroup(item) ? (
                  <li key={item.label}>
                    <h2 className="eyebrow mb-2">{item.label}</h2>
                    <ul className="space-y-1">
                      {item.children.map((link) => (
                        <MobileLink key={link.href} link={link} pathname={pathname} />
                      ))}
                    </ul>
                  </li>
                ) : (
                  <MobileLink key={item.href} link={item} pathname={pathname} />
                ),
              )}
            </ul>
          </nav>

          <div className="border-t border-border p-gutter">
            <Link
              href={cta.href}
              className="pressable flex min-h-12 items-center justify-center rounded-md bg-primary font-display font-semibold text-on-primary hover:bg-primary-hover"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}

function MobileLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
  return (
    <li>
      <Link
        href={link.href}
        aria-current={current ? "page" : undefined}
        className="flex min-h-12 items-center rounded-md px-3 font-display text-lg font-semibold hover:bg-surface-sunken aria-[current=page]:bg-surface-sunken aria-[current=page]:text-link"
      >
        {link.label}
      </Link>
    </li>
  );
}
