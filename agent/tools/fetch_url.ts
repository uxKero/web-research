import { defineTool } from "eve/tools";
import { z } from "zod";

// Cap extracted text so a huge page can't blow the context window.
const MAX_CHARS = 50_000;
// Don't wait forever on a slow or hanging server.
const TIMEOUT_MS = 15_000;

// Crude but dependency-free readability pass: drop the parts of an HTML page
// that are never prose (scripts, styles, head metadata), strip the remaining
// tags, and collapse whitespace. Good enough to feed an LLM; not a parser.
function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    // Turn block-level closers into newlines so structure survives.
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr|br)\s*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    // Decode the handful of entities that actually matter for reading.
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g, " ").trim() : undefined;
}

export default defineTool({
  description:
    "Fetch a single web page and return its readable text content (HTML tags stripped, truncated for context safety). Use this to gather a source while researching a question. Call it once per URL across all the sources you want to consult, then synthesize.",
  inputSchema: z.object({
    url: z
      .string()
      .url()
      .describe("Absolute URL of the page to fetch, e.g. https://example.com/article"),
  }),
  async execute({ url }) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          // Some sites 403 a bare fetch; present a normal UA.
          "user-agent":
            "Mozilla/5.0 (compatible; EveWebResearch/0.1; +https://eve.dev)",
          accept: "text/html,application/xhtml+xml,text/plain,*/*",
        },
      });

      if (!res.ok) {
        return {
          url,
          ok: false,
          status: res.status,
          error: `HTTP ${res.status} ${res.statusText}`.trim(),
        };
      }

      const contentType = res.headers.get("content-type") ?? "";
      const raw = await res.text();
      const isHtml = /html/i.test(contentType) || /^\s*</.test(raw);
      const text = isHtml ? htmlToText(raw) : raw.trim();
      const truncated = text.length > MAX_CHARS;

      return {
        url: res.url, // final URL after redirects — cite this one
        ok: true,
        status: res.status,
        title: isHtml ? extractTitle(raw) : undefined,
        contentType,
        chars: text.length,
        truncated,
        content: text.slice(0, MAX_CHARS),
      };
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError";
      return {
        url,
        ok: false,
        error: aborted ? `Timed out after ${TIMEOUT_MS}ms` : String(err),
      };
    } finally {
      clearTimeout(timer);
    }
  },
});
