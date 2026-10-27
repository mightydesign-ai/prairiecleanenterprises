"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Preview = { src: string; fallback: string; name: string; href: string | null };

/** Payload names resized copies "<name>-480x295.webp"; the original is "<name>.webp". */
function originalOf(src: string): string {
  try {
    const url = new URL(src, window.location.origin);
    url.search = "";
    url.pathname = url.pathname.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, "$1");
    return url.toString();
  } catch {
    return src;
  }
}

/**
 * Admin-wide helper for the Media library: clicking a thumbnail in a list (the Media page or the "choose an image"
 * panel) opens the full image in a pop-up instead of opening or selecting the record. The record link beside the
 * thumbnail still works, and the pop-up has an "Open record" link.
 */
export function MediaPreviewProvider({ children }: { children?: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const img = target?.closest?.(".thumbnail img") as HTMLImageElement | null;
      if (!img || !img.closest("table, .table, .list-drawer, .upload-relationship-details") || img.closest("dialog")) return;
      const row = img.closest("tr");
      const anchor = (row?.querySelector("a[href*='/collections/media/']") as HTMLAnchorElement | null) ?? null;
      event.preventDefault();
      event.stopPropagation();
      lastFocus.current = (img.closest("a,button") as HTMLElement | null) ?? img;
      setPreview({
        src: originalOf(img.currentSrc || img.src),
        fallback: img.currentSrc || img.src,
        name: decodeURIComponent((img.currentSrc || img.src).split("/").pop()?.split("?")[0] ?? "Image"),
        href: anchor?.getAttribute("href") ?? null,
      });
    };
    // Capture phase so we run before the row/link handlers.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (preview && !dialog.open) dialog.showModal();
    if (!preview && dialog.open) dialog.close();
  }, [preview]);

  const close = useCallback(() => {
    setPreview(null);
    lastFocus.current?.focus?.();
  }, []);

  return (
    <>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={preview ? `Preview of ${preview.name}` : "Image preview"}
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        style={{
          padding: 0,
          border: "none",
          borderRadius: 8,
          maxWidth: "min(92vw, 1100px)",
          maxHeight: "92vh",
          background: "var(--theme-bg, #fff)",
          color: "var(--theme-text, #111)",
          overflow: "auto",
        }}
      >
        {preview ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <strong style={{ overflowWrap: "anywhere" }}>{preview.name}</strong>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {preview.href ? (
                  <a href={preview.href} style={{ padding: "6px 12px", border: "1px solid currentColor", borderRadius: 4, color: "inherit" }}>
                    Open record
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  style={{ padding: "6px 12px", border: "1px solid currentColor", borderRadius: 4, background: "transparent", color: "inherit", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.src}
              alt={preview.name}
              onError={(e) => {
                if (e.currentTarget.src !== preview.fallback) e.currentTarget.src = preview.fallback;
              }}
              style={{ maxWidth: "100%", maxHeight: "72vh", objectFit: "contain", background: "repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 16px 16px" }}
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
