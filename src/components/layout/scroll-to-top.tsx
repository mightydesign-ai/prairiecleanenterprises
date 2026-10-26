"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Next scrolls the new page's first element to the top of the window after a
 * client navigation. Under the sticky header that leaves the page shifted down
 * by the header's height. Put the window back at the very top, instantly, so
 * every page opens at the top (links with a #hash are left alone).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const frame = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previous;
    });
    return () => {
      cancelAnimationFrame(frame);
      html.style.scrollBehavior = previous;
    };
  }, [pathname]);

  return null;
}
