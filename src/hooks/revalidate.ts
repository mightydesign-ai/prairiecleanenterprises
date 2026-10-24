import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Content edits refresh the cached public site straight away.
 * The site is small, so every edit revalidates the whole layout: simple and always correct.
 * Outside a Next.js request (seed script, migrations) there is nothing to revalidate.
 */
async function revalidateSite(context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return;
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    // Not running inside Next.js.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidateSite(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidateSite(req.context);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await revalidateSite(req.context);
  return doc;
};
