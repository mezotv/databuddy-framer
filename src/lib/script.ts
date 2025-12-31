import { framer } from "framer-plugin";

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

const databuddyScriptUrl = "https://cdn.databuddy.cc/databuddy.js";
export const databuddyDashboardUrl = "https://app.databuddy.cc/websites";

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
  const clientId =
    (await framer.getPluginData(`${SETTING_PREFIX}clientId`)) ?? "";

  if (!clientId) {
    return "";
  }

  const dataAttributes = await createDataAttributes();
  const attrString = dataAttributes ? `\n    ${dataAttributes}` : "";

  return `<script
    src="${databuddyScriptUrl}"
    data-client-id="${clientId}"${attrString}
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
