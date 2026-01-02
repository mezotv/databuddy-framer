import { Globe } from "@phosphor-icons/react";
import { framer } from "framer-plugin";
import { Info } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "./framer.css";
import "./App.css";

import { Checkbox } from "./components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { useCustomCode } from "./hooks/use-custom-code";
import {
  getDatabuddyDashboardUrl,
  removeScript,
  updateScript,
} from "./lib/script";
import {
  getDefaultValue,
  loadSettings,
  type Settings,
  saveSetting,
} from "./lib/settings";
import type { TrackingFields } from "./types/tracking-options";
import { trackingOptions } from "./util/integration";

framer.showUI({
  position: "top right",
  width: 300,
  height: 460,
});

interface OptionRowProps {
  option: TrackingFields;
  checked: boolean;
  disabled?: boolean;
  onChange: (id: string, checked: boolean) => void;
}

function OptionRow({ option, checked, disabled, onChange }: OptionRowProps) {
  return (
    <div className="option-row">
      <div className={`option-label ${disabled ? "disabled" : ""}`}>
        <span>{option.label}</span>
        <Tooltip>
          <TooltipTrigger render={<Info className="info-icon" />} />
          <TooltipContent className="tooltip-large" side="top">
            <p>{option.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(option.id, e.target.checked)}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  options: TrackingFields[];
  settings: Settings;
  disabled?: boolean;
  onChange: (id: string, checked: boolean) => void;
  showDivider?: boolean;
}

function Section({
  title,
  options,
  settings,
  disabled,
  onChange,
  showDivider = true,
}: SectionProps) {
  const enabledCount = options.filter((option) => {
    const value = settings[option.id];
    return value === "true" || (value === null && option.default);
  }).length;

  return (
    <>
      {showDivider && <div className="divider" />}
      <div className="section">
        <div className="section-header">
          <span className="section-title">{title}</span>
          <span className="section-count">
            {enabledCount}/{options.length}
          </span>
        </div>
        {options.map((option) => {
          const value = settings[option.id];
          const checked =
            value === null ? getDefaultValue(option.id) : value === "true";
          return (
            <OptionRow
              checked={checked}
              disabled={disabled}
              key={option.id}
              onChange={onChange}
              option={option}
            />
          );
        })}
      </div>
    </>
  );
}

export function App() {
  const customCode = useCustomCode();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [clientId, setClientId] = useState("");
  const [customDashboardUrl, setCustomDashboardUrl] = useState("");
  const [customCdnUrl, setCustomCdnUrl] = useState("");
  const [showSelfHosted, setShowSelfHosted] = useState(false);

  const isLoading = !customCode || settings === null;
  const isInstalled = customCode?.headEnd?.html != null;

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setClientId(s.clientId ?? "");
      setCustomDashboardUrl(s.customDashboardUrl ?? "");
      setCustomCdnUrl(s.customCdnUrl ?? "");
    });
  }, []);

  const handleSettingChange = useCallback(
    async (id: string, checked: boolean) => {
      const value = checked ? "true" : "false";
      await saveSetting(id, value);
      setSettings((prev) => (prev ? { ...prev, [id]: value } : null));
      if (isInstalled) {
        await updateScript();
      }
    },
    [isInstalled]
  );

  const handleClientIdChange = useCallback(
    async (value: string) => {
      setClientId(value);
      await saveSetting("clientId", value || null);
      if (isInstalled) {
        await updateScript();
      }
    },
    [isInstalled]
  );

  const handleCustomDashboardUrlChange = useCallback(
    async (value: string) => {
      setCustomDashboardUrl(value);
      await saveSetting("customDashboardUrl", value || null);
      if (isInstalled) {
        await updateScript();
      }
    },
    [isInstalled]
  );

  const handleCustomCdnUrlChange = useCallback(
    async (value: string) => {
      setCustomCdnUrl(value);
      await saveSetting("customCdnUrl", value || null);
      if (isInstalled) {
        await updateScript();
      }
    },
    [isInstalled]
  );

  const handleInstall = useCallback(async () => {
    if (isInstalled) {
      await removeScript();
    } else {
      await updateScript();
    }
  }, [isInstalled]);

  const handleOpenDashboard = useCallback(async () => {
    const dashboardUrl = await getDatabuddyDashboardUrl();
    window.open(`${dashboardUrl}/${clientId}`, "_blank");
  }, [clientId]);

  if (isLoading) {
    return (
      <main style={{ alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--framer-color-text-secondary)" }}>
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main>
      <div className="input-group">
        <label className="input-label" htmlFor="clientId">
          Client ID
        </label>
        <input
          id="clientId"
          onChange={(e) => handleClientIdChange(e.target.value)}
          placeholder="Enter your Databuddy Client ID"
          type="text"
          value={clientId}
        />
      </div>

      <div className="scroll-area">
        <Section
          disabled={!isInstalled}
          onChange={handleSettingChange}
          options={trackingOptions.coreTracking}
          settings={settings}
          showDivider={false}
          title="Core Tracking"
        />

        <Section
          disabled={!isInstalled}
          onChange={handleSettingChange}
          options={trackingOptions.advancedFeatures}
          settings={settings}
          title="Advanced Features"
        />

        <div className="divider" />
        <div className="section">
          <div className="section-header">
            <span className="section-title">Misc</span>
          </div>
          <div className="self-hosted-section">
            <button
              className="self-hosted-toggle"
              onClick={() => setShowSelfHosted(!showSelfHosted)}
              type="button"
            >
              <span>Self-Hosted Options</span>
              <span
                className={`toggle-arrow ${showSelfHosted ? "expanded" : ""}`}
              >
                ▼
              </span>
            </button>
            {showSelfHosted && (
              <div className="self-hosted-content">
                <div className="input-group">
                  <label className="input-label" htmlFor="customDashboardUrl">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>Dashboard URL</span>
                      <Tooltip>
                        <TooltipTrigger
                          render={<Info className="info-icon" />}
                        />
                        <TooltipContent className="tooltip-large" side="top">
                          <p>
                            Custom dashboard URL for self-hosted Databuddy
                            instances. Leave empty to use the default hosted
                            dashboard.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </label>
                  <input
                    id="customDashboardUrl"
                    onChange={(e) =>
                      handleCustomDashboardUrlChange(e.target.value)
                    }
                    placeholder="https://app.databuddy.cc/websites"
                    type="url"
                    value={customDashboardUrl}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="customCdnUrl">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span>CDN URL</span>
                      <Tooltip>
                        <TooltipTrigger
                          render={<Info className="info-icon" />}
                        />
                        <TooltipContent className="tooltip-large" side="top">
                          <p>
                            Custom CDN URL for the Databuddy tracking script.
                            Leave empty to use the default CDN.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </label>
                  <input
                    id="customCdnUrl"
                    onChange={(e) => handleCustomCdnUrlChange(e.target.value)}
                    placeholder="https://cdn.databuddy.cc/databuddy.js"
                    type="url"
                    value={customCdnUrl}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="status-row" style={{ marginBottom: 10 }}>
          <span>Status</span>
          <div className="status-indicator">
            <span className={`status-dot ${isInstalled ? "active" : ""}`} />
            <span>{isInstalled ? "Installed" : "Not installed"}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={
              isInstalled ? "framer-button-secondary" : "framer-button-primary"
            }
            disabled={!clientId}
            onClick={handleInstall}
            style={{ flex: 1 }}
            type="button"
          >
            {isInstalled ? "Remove Script" : "Install Script"}
          </button>
          <button
            className="framer-button-secondary"
            disabled={!clientId}
            onClick={handleOpenDashboard}
            style={{ width: 30, padding: 0 }}
            title="Open Dashboard"
            type="button"
          >
            <Globe size={16} />
          </button>
        </div>
        {!clientId && (
          <p className="footer-hint">
            Enter your Client ID to install the script
          </p>
        )}
      </div>
    </main>
  );
}
