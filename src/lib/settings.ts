import { framer } from "framer-plugin";
import type { TrackingFields } from "../types/tracking-options";
import { trackingOptions } from "../util/integration";

const SETTING_PREFIX = "databuddy-";

export type Settings = Record<string, string | null>;

function getAllOptionIds(): string[] {
  const ids: string[] = ["clientId", "customDashboardUrl", "customCdnUrl"];

  const categories = Object.values(trackingOptions) as TrackingFields[][];
  for (const category of categories) {
    for (const option of category) {
      ids.push(option.id);
    }
  }

  return ids;
}

export async function loadSettings(): Promise<Settings> {
  const settings: Settings = {};
  const ids = getAllOptionIds();

  for (const id of ids) {
    const value = await framer.getPluginData(`${SETTING_PREFIX}${id}`);
    settings[id] = value;
  }

  return settings;
}

export async function saveSetting(
  id: string,
  value: string | null
): Promise<void> {
  await framer.setPluginData(`${SETTING_PREFIX}${id}`, value);
}

export function getDefaultValue(id: string): boolean {
  const categories = Object.values(trackingOptions) as TrackingFields[][];
  for (const category of categories) {
    const option = category.find((o) => o.id === id);
    if (option) {
      return option.default;
    }
  }

  return false;
}
