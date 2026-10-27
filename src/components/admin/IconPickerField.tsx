"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ICONS } from "@/lib/icons/registry";

/** Searchable icon grid with a live preview. Stores the icon's name (for example "rocket"). */
export const IconPickerField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byGroup = new Map<string, [string, string][]>();
    for (const [name, def] of Object.entries(ICONS)) {
      if (q && !name.includes(q) && !def.l.toLowerCase().includes(q) && !def.g.toLowerCase().includes(q)) continue;
      const list = byGroup.get(def.g) ?? [];
      list.push([name, def.l]);
      byGroup.set(def.g, list);
    }
    return [...byGroup.entries()];
  }, [query]);

  const current = value && ICONS[value] ? ICONS[value] : null;

  return (
    <div className="field-type pce-icon-pick" style={{ marginBottom: "var(--base)" }}>
      <style>{`.pce-icon-pick svg{width:26px;height:26px}`}</style>
      <FieldLabel label={field.label || "Icon"} path={path} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", width: 48, height: 48, alignItems: "center", justifyContent: "center", border: "1px solid var(--theme-elevation-150)", borderRadius: 8 }}
        >
          {current ? <Icon name={value} solid className="" /> : null}
        </span>
        <span>{current ? current.l : "No icon"}</span>
        <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <span className="btn__content">{open ? "Close" : current ? "Change icon" : "Choose icon"}</span>
        </button>
        {current ? (
          <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => setValue("")}>
            <span className="btn__content">Remove</span>
          </button>
        ) : null}
      </div>
      {open ? (
        <div style={{ marginTop: 12, border: "1px solid var(--theme-elevation-150)", borderRadius: 8, padding: 12, maxHeight: 360, overflow: "auto" }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons, e.g. plant, truck, energy"
            aria-label="Search icons"
            style={{ width: "100%", marginBottom: 12 }}
          />
          {groups.length === 0 ? <p>No icons match.</p> : null}
          {groups.map(([group, list]) => (
            <div key={group} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{group}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 6 }}>
                {list.map(([name, label]) => (
                  <button
                    key={name}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={value === name}
                    onClick={() => {
                      setValue(name);
                      setOpen(false);
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      padding: 8,
                      cursor: "pointer",
                      background: value === name ? "var(--theme-elevation-100)" : "transparent",
                      border: value === name ? "2px solid var(--theme-text)" : "1px solid var(--theme-elevation-150)",
                      borderRadius: 6,
                      color: "var(--theme-text)",
                    }}
                  >
                    <Icon name={name} solid className="" />
                    <span style={{ fontSize: 11, lineHeight: 1.2, textAlign: "center" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
