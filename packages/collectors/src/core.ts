import crypto from "node:crypto";

/** Remove volatile executable markup and normalize whitespace before hashing. */
export function normalizeContent(body: string): string {
  return body
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<(script|style|noscript)\b[^>]*>[^]*?<\/\1>/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export function hashContent(body: string): string {
  return crypto.createHash("sha256").update(normalizeContent(body)).digest("hex");
}

export function collectorEventId(sourceId: string): string {
  return `scrape-${sourceId}-${crypto.randomUUID()}`;
}
