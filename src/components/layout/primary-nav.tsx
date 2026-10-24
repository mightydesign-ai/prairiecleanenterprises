"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isGroup, type NavItem, type NavLink } from "@/lib/site";

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Desktop navigation using the disclosure pattern (not an ARIA menu):
 * group buttons expose aria-expanded, Escape closes and returns focus,
 * and a click or focus outside closes the open panel.
 */
export function PrimaryNav({ items, className = "" }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close on route change.
  useEffect(() => setOpenLabel(null), [pathname]);

  // Close on outside pointer or focus.
  useEffect(() => {
    if (!openLabel) return;
    const onOutside = (event: Event) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenLabel(null);
    };
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [openLabel]);

  return (
    <nav ref={navRef} aria-label="Main" className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) =>
          isGroup(item) ? (
            <NavGroup
              key={item.label}
              label={item.label}
              links={item.children}
              pathname={pathname}
              open={openLabel === item.label}
              onToggle={(next) => setOpenLabel(next ? item.label : null)}
            />
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className="relative inline-flex min-h-11 items-center rounded-md px-3 font-display text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-sunken aria-[current=page]:text-link aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:bottom-1.5 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-primary"
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

function NavGroup({
  label,
  links,
  pathname,
  open,
  onToggle,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
  open: boolean;
  onToggle: (open: boolean) => void;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const groupActive = links.some((l) => isCurrent(pathname, l.href));

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      onToggle(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <li className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(!open)}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 font-display text-sm font-medium transition-colors duration-150 hover:bg-surface-sunken aria-expanded:bg-surface-sunken ${
          groupActive ? "text-link" : "text-fg"
        }`}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`size-3.5 transition-transform duration-200 ease-out-quint ${open ? "rotate-180" : ""}`}
        >
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-1/2 top-full z-10 mt-2 w-80 -translate-x-1/2 animate-menu-in rounded-lg border border-border bg-surface p-2 shadow-raised"
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className="block rounded-md px-3 py-2.5 transition-colors duration-150 hover:bg-surface-sunken aria-[current=page]:bg-surface-sunken"
              >
                <span className="block font-display text-sm font-semibold text-fg">{link.label}</span>
                {link.description ? (
                  <span className="mt-0.5 block text-xs text-fg-muted">{link.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
