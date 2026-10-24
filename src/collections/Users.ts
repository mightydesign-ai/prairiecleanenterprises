import type { CollectionConfig } from "payload";
import { admins, adminsField, authenticated } from "@/access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "Settings",
  },
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    read: authenticated,
    create: admins,
    update: ({ req: { user }, id }) => {
      if (!user) return false;
      if ((user as { role?: string }).role === "admin") return true;
      return user.id === id;
    },
    delete: admins,
  },
  hooks: {
    beforeChange: [
      // The very first account (created at /admin on a fresh install) is always an admin.
      async ({ data, operation, req }) => {
        if (operation === "create") {
          const { totalDocs } = await req.payload.count({ collection: "users", req });
          if (totalDocs === 0) data.role = "admin";
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      access: { update: adminsField, create: adminsField },
      options: [
        { label: "Admin: everything, including staff accounts", value: "admin" },
        { label: "Editor: content and inboxes", value: "editor" },
      ],
    },
  ],
};
