"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type Row = { id?: string | number; filename?: string; alt?: string; url?: string; thumbnailURL?: string; sizes?: Record<string, { url?: string } | undefined> };

type Use = { label: string; where: string };

const q = encodeURIComponent;

/** Looks up where an image is used, so the confirmation can say what will lose it. Failures just mean "unknown". */
async function findUses(id: string | number): Promise<Use[] | null> {
  const get = async (path: string, collection: string, titleKey: string, where: string): Promise<Use[]> => {
    try {
      const res = await fetch(`/api/${collection}?limit=6&depth=0&${path}`, { credentials: "same-origin" });
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

export function MediaDeleteCell({ rowData }: { rowData?: Row }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [uses, setUses] = useState<Use[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = rowData?.id;
  const name = rowData?.filename ?? "this image";
  const thumb = rowData?.sizes?.thumb?.url ?? rowData?.thumbnailURL ?? rowData?.url;

  // The "choose an image" panel is for picking, not deleting.
  useEffect(() => {
    if (triggerRef.current?.closest(".list-drawer, .drawer")) setHidden(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (hidden || id === undefined) return null;

  const openDialog = async () => {
    setError(null);
    setUses(undefined);
    setOpen(true);
    setUses(await findUses(id));
  };
  const close = () => {
    if (busy) return;
    setOpen(false);
    triggerRef.current?.focus();
  };
  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/media/${encodeURIComponent(String(id))}`, { method: "DELETE", credentials: "same-origin" });
      if (!res.ok) throw new Error(`The server said ${res.status}`);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(`Couldn't delete it. ${e instanceof Error ? e.message : ""} Nothing was changed.`);
    } finally {
      setBusy(false);
    }
  };

  const used = Array.isArray(uses) && uses.length > 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-label={`Delete ${name}`}
        title="Delete"
        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--theme-error-500, #b42318)", padding: 6, display: "inline-flex" }}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
        </svg>
      </button>
      {createPortal(
        <dialog
          ref={dialogRef}
          role="alertdialog"
          aria-labelledby={`del-h-${id}`}
          aria-describedby={`del-d-${id}`}
          onClose={() => setOpen(false)}
          onCancel={(e) => {
            if (busy) e.preventDefault();
          }}
          style={{ width: "min(92vw, 460px)", padding: 0, border: "none", borderRadius: 8, background: "var(--theme-bg, #fff)", color: "var(--theme-text, #111)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
            <h2 id={`del-h-${id}`} style={{ margin: 0, fontSize: 20 }}>
              Delete this image?
            </h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4, flexShrink: 0, background: "#eee" }} />
              ) : null}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, overflowWrap: "anywhere" }}>{name}</div>
                {rowData?.alt ? <div style={{ fontSize: 13, opacity: 0.75, overflowWrap: "anywhere" }}>{rowData.alt}</div> : null}
              </div>
            </div>
            <div id={`del-d-${id}`} style={{ fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0 }}>This permanently deletes the image and its resized copies. It can&rsquo;t be undone.</p>
              {uses === undefined ? (
                <p style={{ margin: 0, opacity: 0.75 }}>Checking where it&rsquo;s used&hellip;</p>
              ) : used ? (
                <div style={{ border: "1px solid var(--theme-warning-500, #b54708)", borderRadius: 4, padding: 10 }}>
                  <strong>It&rsquo;s used in {uses!.length === 6 ? "6 or more places" : `${uses!.length} place${uses!.length === 1 ? "" : "s"}`}:</strong>
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
                <p role="alert" style={{ margin: 0, color: "var(--theme-error-500, #b42318)" }}>
                  {error}
                </p>
              ) : null}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                type="button"
                onClick={close}
                autoFocus
                disabled={busy}
                style={{ ...buttonBase, background: "transparent", color: "inherit", borderColor: "currentColor" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={busy}
                style={{ ...buttonBase, background: "var(--theme-error-500, #b42318)", color: "#fff", opacity: busy ? 0.7 : 1 }}
              >
                {busy ? "Deleting…" : "Delete image"}
              </button>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
}
