import { framer } from "framer-plugin";
import {
  appendPathSegment,
  escapeHtmlAttribute,
  normalizeClientId,
  normalizeHttpUrl,
} from "../util/security";

const SETTING_PREFIX = "databuddy-";

const attributeMap: Record<string, string> = {
  hashChanges: "data-track-hash-changes",
  dataAttributes: "data-track-attributes",
  outboundLinks: "data-track-outgoing-links",
  interactions: "data-track-interactions",
  performance: "data-track-performance",
  scrollDepth: "data-track-scroll-depth",
  webVitals: "data-track-web-vitals",
  errors: "data-track-errors",
};

const DEFAULT_CDN_URL = "https://cdn.databuddy.cc/databuddy.js";
const DEFAULT_DASHBOARD_URL = "https://app.databuddy.cc/websites";

export async function getDatabuddyScriptUrl(): Promise<string> {
  const customUrl = await framer.getPluginData(`${SETTING_PREFIX}customCdnUrl`);
  return customUrl
    ? normalizeHttpUrl(customUrl, DEFAULT_CDN_URL)
    : DEFAULT_CDN_URL;
}

export async function getDatabuddyDashboardUrl(): Promise<string> {
  const customUrl = await framer.getPluginData(
    `${SETTING_PREFIX}customDashboardUrl`
  );
  return customUrl
    ? normalizeHttpUrl(customUrl, DEFAULT_DASHBOARD_URL)
    : DEFAULT_DASHBOARD_URL;
}

export async function getDatabuddyDashboardLink(
  clientId: string
): Promise<string | null> {
  const normalizedClientId = normalizeClientId(clientId);

  if (!normalizedClientId) {
    return null;
  }

  const dashboardUrl = appendPathSegment(
    new URL(await getDatabuddyDashboardUrl()),
    normalizedClientId
  );

  return dashboardUrl.href;
}

async function createDataAttributes(): Promise<string> {
  const attributes: string[] = [];

  for (const [settingId, dataAttr] of Object.entries(attributeMap)) {
    const value = await framer.getPluginData(`${SETTING_PREFIX}${settingId}`);
    if (value === "true") {
      attributes.push(`${dataAttr}="true"`);
    }
  }

  return attributes.join("\n    ");
}

export async function createScript(): Promise<string> {
  const clientId = normalizeClientId(
    (await framer.getPluginData(`${SETTING_PREFIX}clientId`)) ?? ""
  );

  if (!clientId) {
    return "";
  }

  const scriptUrl = await getDatabuddyScriptUrl();
  const dataAttributes = await createDataAttributes();
  const attrString = dataAttributes ? `\n    ${dataAttributes}` : "";

  return `<script
    src="${escapeHtmlAttribute(scriptUrl)}"
    data-client-id="${escapeHtmlAttribute(clientId)}"${attrString}
    crossorigin="anonymous"
    async
></script>`;
}

export async function updateScript(): Promise<void> {
  const script = await createScript();

  await framer.setCustomCode({
    html: script,
    location: "headEnd",
  });
}

export async function removeScript(): Promise<void> {
  await framer.setCustomCode({
    html: null,
    location: "headEnd",
  });
}
