const CLIENT_ID_PATTERN = /^[A-Za-z0-9_.:-]+$/;
const TRAILING_SLASH_PATTERN = /\/$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function normalizeHttpUrl(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed && isHttpUrl(trimmed) ? new URL(trimmed).href : fallback;
}

export function normalizeClientId(value: string): string {
  const trimmed = value.trim();
  return CLIENT_ID_PATTERN.test(trimmed) ? trimmed : "";
}

export function escapeHtmlAttribute(value: string): string {
  return value.replace(/["&<>]/g, (char) => {
    switch (char) {
      case '"':
        return "&quot;";
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return char;
    }
  });
}

export function appendPathSegment(url: URL, segment: string): URL {
  url.pathname = `${url.pathname.replace(TRAILING_SLASH_PATTERN, "")}/${encodeURIComponent(segment)}`;
  return url;
}
