"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin-wide helper for the Media library (mounted once, as an admin provider):
 *  - clicking a thumbnail opens a larger preview with file size and dimensions;
 *  - every row on the Media list page gets a trash button, and the preview has one too;
 *  - deleting always goes through a confirmation that names the image and lists where it is used.
 * It works from the page itself, so it keeps working whichever columns a person has switched on.
 */

type Target = { id: string | number; filename: string; alt?: string; thumb?: string };
type Preview = {
  src: string;
  fallback: string;
  filename: string;
  href: string | null;
  id?: string | number;
  alt?: string;
  filesize?: number;
  width?: number;
  height?: number;
};
type Use = { label: string; where: string };

const q = encodeURIComponent;
const ICON =
  '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/></svg>';
const RED = "var(--theme-error-500, #b42318)";

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

const fileNameOf = (src: string) => {
  try {
    return decodeURIComponent(new URL(src, window.location.origin).pathname.split("/").pop() ?? "Image");
  } catch {
    return "Image";
  }
};

const formatSize = (bytes?: number) => {
  if (bytes === undefined) return null;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

/** Where is this image used? Failures just mean "unknown". */
async function findUses(id: string | number): Promise<Use[] | null> {
  const get = async (query: string, collection: string, titleKey: string, where: string): Promise<Use[]> => {
    try {
      const res = await fetch(`/api/${collection}?limit=6&depth=0&${query}`, { credentials: "same-origin" });
      if (!res.ok) return [];
      const json = (await res.json()) as { docs?: Record<string, unknown>[] };
      return (json.docs ?? []).map((d) => ({ label: String(d[titleKey] ?? "Untitled"), where }));
    } catch {
      return [];
    }
  };
  const eq = (field: string, i = 0) => `where[or][${i}][${field}][equals]=${q(String(id))}`;
  try {
    const results = await Promise.all([
      get(eq("image"), "news", "title", "News story"),
      get(eq("logo"), "partners", "name", "Partner logo"),
      get(eq("photo"), "team", "name", "Team photo"),
      get(`${eq("heroImage")}&${eq("sections.image", 1)}`, "products", "name", "Product page"),
      get(`${eq("layout.image")}&${eq("layout.items.image", 1)}`, "pages", "title", "Page"),
    ]);
    return results.flat();
  } catch {
    return null;
  }
}

const buttonBase = { padding: "8px 16px", borderRadius: 4, fontSize: 14, cursor: "pointer", border: "1px solid transparent" } as const;
const outlineBtn = { padding: "6px 12px", border: "1px solid currentColor", borderRadius: 4, background: "transparent", color: "inherit", cursor: "pointer", fontSize: 14 } as const;
const dialogStyle = { padding: 0, border: "none", borderRadius: 8, background: "var(--theme-bg, #fff)", color: "var(--theme-text, #111)" } as const;

const CSS = `
html[data-pce-media] table td, html[data-pce-media] table th, .list-drawer table td, .list-drawer table th { vertical-align: middle !important; }
td.pce-del-cell { position: relative; padding-right: 56px !important; }
button.pce-del { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; border-radius: 4px; background: transparent; color: ${RED}; cursor: pointer; }
button.pce-del:hover, button.pce-del:focus-visible { background: color-mix(in srgb, ${RED} 12%, transparent); outline: none; }
button.pce-del:focus-visible { box-shadow: 0 0 0 2px ${RED}; }
`;

export function MediaPreviewProvider({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDialogElement>(null);
  const deleteRef = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [target, setTarget] = useState<Target | null>(null);
  const [uses, setUses] = useState<Use[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // --- Row trash buttons + list styling -------------------------------------------------------------------------
  useEffect(() => {
    const decorate = () => {
      const onMediaPage = /\/collections\/media\/?$/.test(window.location.pathname);
      if (onMediaPage) document.documentElement.setAttribute("data-pce-media", "");
      else document.documentElement.removeAttribute("data-pce-media");
      if (!onMediaPage) return;
      document.querySelectorAll<HTMLTableRowElement>("table tbody tr").forEach((row) => {
        if (row.querySelector("button.pce-del") || row.closest(".list-drawer")) return;
        const link = row.querySelector<HTMLAnchorElement>("a[href*='/collections/media/']");
        const id = link?.getAttribute("href")?.split("/").pop();
        if (!link || !id) return;
        const filename = (link.textContent ?? "").trim() || "this image";
        const cells = row.querySelectorAll("td");
        const cell = cells[cells.length - 1];
        if (!cell) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pce-del";
        btn.setAttribute("aria-label", `Delete ${filename}`);
        btn.title = "Delete";
        btn.dataset.id = id;
        btn.dataset.filename = filename;
        btn.innerHTML = ICON;
        cell.classList.add("pce-del-cell");
        cell.appendChild(btn);
      });
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(decorate);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // --- Clicks: thumbnails open the preview, row trash buttons open the delete confirmation ---------------------
  const openDelete = useCallback(async (t: Target) => {
    setError(null);
    setUses(undefined);
    setTarget(t);
    setUses(await findUses(t.id));
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      const trash = el?.closest?.("button.pce-del") as HTMLButtonElement | null;
      if (trash) {
        event.preventDefault();
        event.stopPropagation();
        lastFocus.current = trash;
        const row = trash.closest("tr");
        const img = row?.querySelector<HTMLImageElement>(".thumbnail img");
        void openDelete({
          id: trash.dataset.id as string,
          filename: trash.dataset.filename ?? "this image",
          thumb: img?.currentSrc || img?.src,
          alt: row?.querySelectorAll("td")[2]?.textContent?.replace("<No Alt text>", "").trim() || undefined,
        });
        return;
      }
      const img = el?.closest?.(".thumbnail img") as HTMLImageElement | null;
      if (!img || !img.closest("table, .table, .list-drawer, .upload-relationship-details") || img.closest("dialog")) return;
      const anchor = img.closest("tr")?.querySelector<HTMLAnchorElement>("a[href*='/collections/media/']") ?? null;
      event.preventDefault();
      event.stopPropagation();
      lastFocus.current = (img.closest("a,button") as HTMLElement | null) ?? img;
      const shown = img.currentSrc || img.src;
      const full = originalOf(shown);
      const filename = fileNameOf(full);
      setPreview({ src: full, fallback: shown, filename, href: anchor?.getAttribute("href") ?? null });
      // File size, dimensions and id of the original.
      fetch(`/api/media?where[filename][equals]=${q(filename)}&limit=1&depth=0`, { credentials: "same-origin" })
        .then((r) => (r.ok ? r.json() : null))
        .then((json: { docs?: { id: string | number; alt?: string; filesize?: number; width?: number; height?: number }[] } | null) => {
          const d = json?.docs?.[0];
          if (d) setPreview((p) => (p && p.filename === filename ? { ...p, id: d.id, alt: d.alt, filesize: d.filesize, width: d.width, height: d.height } : p));
        })
        .catch(() => undefined);
    };
    document.addEventListener("click", onClick, true); // capture: run before the row/link handlers
    return () => document.removeEventListener("click", onClick, true);
  }, [openDelete]);

  useEffect(() => {
    const d = previewRef.current;
    if (!d) return;
    if (preview && !d.open) d.showModal();
    if (!preview && d.open) d.close();
  }, [preview]);
  useEffect(() => {
    const d = deleteRef.current;
    if (!d) return;
    if (target && !d.open) d.showModal();
    if (!target && d.open) d.close();
  }, [target]);

  const closePreview = useCallback(() => {
    setPreview(null);
    lastFocus.current?.focus?.();
  }, []);
  const closeDelete = useCallback(() => {
    if (busy) return;
    setTarget(null);
    if (!preview) lastFocus.current?.focus?.();
  }, [busy, preview]);

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/${encodeURIComponent(String(target.id))}`, { method: "DELETE", credentials: "same-origin" });
      if (!res.ok) throw new Error(`The server said ${res.status}.`);
      setTarget(null);
      setPreview(null);
      router.refresh();
    } catch (e) {
      setError(`Couldn't delete it. ${e instanceof Error ? e.message : ""} Nothing was changed.`);
    } finally {
      setBusy(false);
    }
  };

  const used = Array.isArray(uses) && uses.length > 0;
  const meta = preview
    ? [preview.filename, formatSize(preview.filesize), preview.width && preview.height ? `${preview.width}px × ${preview.height}px` : null].filter(Boolean).join("  |  ")
    : "";

  return (
    <>
      <style>{CSS}</style>
      {children}

      <dialog
        ref={previewRef}
        aria-label={preview ? `Preview of ${preview.filename}` : "Image preview"}
        onClose={closePreview}
        onClick={(e) => {
          if (e.target === previewRef.current) closePreview();
        }}
        style={{ ...dialogStyle, maxWidth: "min(92vw, 1100px)", maxHeight: "92vh", overflow: "auto" }}
      >
        {preview ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
              <strong style={{ overflowWrap: "anywhere" }}>{meta}</strong>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                {preview.id !== undefined ? (
                  <button
                    type="button"
                    aria-label={`Delete ${preview.filename}`}
                    title="Delete"
                    onClick={() => openDelete({ id: preview.id!, filename: preview.filename, alt: preview.alt, thumb: preview.fallback })}
                    style={{ ...outlineBtn, color: RED, display: "inline-flex", alignItems: "center", padding: "6px 10px" }}
                    dangerouslySetInnerHTML={{ __html: ICON }}
                  />
                ) : null}
                {preview.href ? (
                  <a href={preview.href} style={{ ...outlineBtn, color: "inherit", textDecoration: "underline" }}>
                    Open record
                  </a>
                ) : null}
                <button type="button" onClick={closePreview} autoFocus style={outlineBtn}>
                  Close
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.src}
              alt={preview.alt || preview.filename}
              onError={(e) => {
                if (e.currentTarget.src !== preview.fallback) e.currentTarget.src = preview.fallback;
              }}
              style={{ maxWidth: "100%", maxHeight: "72vh", objectFit: "contain", background: "repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50% / 16px 16px" }}
            />
          </div>
        ) : null}
      </dialog>

      <dialog
        ref={deleteRef}
        role="alertdialog"
        aria-labelledby="pce-del-h"
        aria-describedby="pce-del-d"
        onClose={() => setTarget(null)}
        onCancel={(e) => {
          if (busy) e.preventDefault();
        }}
        style={{ ...dialogStyle, width: "min(92vw, 460px)" }}
      >
        {target ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
            <h2 id="pce-del-h" style={{ margin: 0, fontSize: 20 }}>
              Delete this image?
            </h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {target.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={target.thumb} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4, flexShrink: 0, background: "#eee" }} />
              ) : null}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, overflowWrap: "anywhere" }}>{target.filename}</div>
                {target.alt ? <div style={{ fontSize: 13, opacity: 0.75, overflowWrap: "anywhere" }}>{target.alt}</div> : null}
              </div>
            </div>
            <div id="pce-del-d" style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0 }}>This permanently deletes the image and its resized copies. It can&rsquo;t be undone.</p>
              {uses === undefined ? (
                <p style={{ margin: 0, opacity: 0.75 }}>Checking where it&rsquo;s used&hellip;</p>
              ) : used ? (
                <div style={{ border: "1px solid var(--theme-warning-500, #b54708)", borderRadius: 4, padding: 10 }}>
                  <strong>It&rsquo;s used in {uses!.length >= 6 ? "6 or more places" : `${uses!.length} place${uses!.length === 1 ? "" : "s"}`}:</strong>
                  <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                    {uses!.map((u, i) => (
                      <li key={`${u.where}-${u.label}-${i}`}>
                        {u.where}: {u.label}
                      </li>
                    ))}
                  </ul>
                  <p style={{ margin: "6px 0 0" }}>Those spots will be left without an image.</p>
                </div>
              ) : uses === null ? (
                <p style={{ margin: 0 }}>We couldn&rsquo;t check where it&rsquo;s used.</p>
              ) : (
                <p style={{ margin: 0, opacity: 0.75 }}>Not used on any page, story, product, partner or team member.</p>
              )}
              {error ? (
                <p role="alert" style={{ margin: 0, color: RED }}>
                  {error}
                </p>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={closeDelete} autoFocus disabled={busy} style={{ ...buttonBase, background: "transparent", color: "inherit", borderColor: "currentColor" }}>
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} disabled={busy} style={{ ...buttonBase, background: RED, color: "#fff", opacity: busy ? 0.7 : 1 }}>
                {busy ? "Deleting…" : "Delete image"}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
