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
    // Payload's cookie is not Secure by default. Production is HTTPS only, so mark it Secure and keep it SameSite.
    cookies: { secure: process.env.NODE_ENV === "production", sameSite: "Lax" },
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
    beforeValidate: [
      // Staff passwords: at least 12 characters, not all one kind of character.
      ({ data }) => {
        const pw = (data as { password?: unknown } | undefined)?.password;
        if (typeof pw === "string" && pw.length > 0) {
          if (pw.length < 12) throw new Error("Use a password of at least 12 characters.");
          if (!/[a-z]/.test(pw) || !/[A-Z0-9\W_]/.test(pw)) {
            throw new Error("Mix lower-case letters with capitals, numbers or symbols, or use a long passphrase.");
          }
        }
        return data;
      },
    ],
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
