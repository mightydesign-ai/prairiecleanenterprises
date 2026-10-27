import type { Field } from "payload";
import { BADGE_SIZES, CIRCLES, ICON_COLOURS } from "@/lib/icons/palette";

/** An icon from the bundled Phosphor set, with an optional coloured circle. Empty icon = nothing shown. */
export const iconBadgeField = (name = "iconBadge", label = "Icon"): Field => ({
  name,
  type: "group",
  label,
  admin: { description: "Pick an icon and, if you like, put it in a coloured circle. Leave the icon empty to show none." },
  fields: [
    {
      name: "icon",
      type: "text",
      label: "Icon",
      admin: { components: { Field: "@/components/admin/IconPickerField#IconPickerField" } },
    },
    {
      type: "row",
      fields: [
        {
          name: "style",
          type: "select",
          label: "Style",
          defaultValue: "solid",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "size",
          type: "select",
          label: "Size",
          defaultValue: "md",
          options: Object.entries(BADGE_SIZES).map(([value, v]) => ({ label: v.label, value })),
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "circle",
          type: "select",
          label: "Circle colour",
          defaultValue: "teal",
          options: Object.entries(CIRCLES).map(([value, v]) => ({ label: v.label, value })),
          admin: { width: "50%" },
        },
        {
          name: "iconColour",
          type: "select",
          label: "Icon colour",
          defaultValue: "auto",
          options: Object.entries(ICON_COLOURS).map(([value, v]) => ({ label: v.label, value })),
          admin: { width: "50%", description: "Automatic always has enough contrast. Check contrast if you pick another colour." },
        },
      ],
    },
    {
      name: "label",
      type: "text",
      label: "Description for screen readers (optional)",
      admin: { description: "Leave empty when the icon is only decoration. Fill it in when the icon carries meaning on its own." },
    },
  ],
});
