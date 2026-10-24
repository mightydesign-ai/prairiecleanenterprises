/**
 * Search and AI indexing switch.
 *
 * The site stays out of search engines and AI crawlers unless SITE_INDEXABLE is exactly "true".
 * Set it on Vercel (Production only) at launch, once the site is on PCE's domain, then redeploy.
 * The same check is repeated in next.config.ts, which can't import from src/.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

/** Crawlers that collect content for AI models and AI answers. */
export const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
  "Timpibot",
  "omgilibot",
  "ImagesiftBot",
];
