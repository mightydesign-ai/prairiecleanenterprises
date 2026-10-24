import type { Access, FieldAccess } from "payload";

type Role = "admin" | "editor";

const role = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role;

/** Any signed-in staff member. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);

/** Admins only (user management, deleting submissions). */
export const admins: Access = ({ req: { user } }) => role(user) === "admin";

export const adminsField: FieldAccess = ({ req: { user } }) => role(user) === "admin";

/** Public site sees published documents; staff see drafts too. */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true;
  return { _status: { equals: "published" } };
};

/** Public site sees everything in collections without drafts. */
export const anyone: Access = () => true;

/** Form inboxes: nobody creates through the public API; server actions use the local API. */
export const nobody: Access = () => false;
