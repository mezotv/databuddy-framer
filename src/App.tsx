"use client"
import { framer } from "framer-plugin";
import "./App.css";
import { useState } from "react"
import { trackingOptions } from "./lib/data";
import type { TrackingFieldsI } from "./types/options";

framer.showUI({
  position: "top right",
  width: 400,
  height: 700,
});

export function App() {
  const [websiteId, setWebsiteId] = useState("")
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [settings, setSettings] = useState(() => {
    const initialSettings: Record<string, boolean> = {}
    Object.values(trackingOptions)
      .flat()
      .forEach((option) => {
        initialSettings[option.id] = option.default
      })
    return initialSettings
  })

  const handleSettingChange = (id: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: value }))
  }

  const formatSectionTitle = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }
  
  return (
    <main >
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 grid grid-cols-subgrid gap-4">
          <div className="flex flex-col items-start gap-2 col-span-4 w-full">
            <label htmlFor="website-id" className="text-sm font-medium text-foreground">
            Enter your Website ID
            </label>
            <input
              type="text"
              id="website-id"
              placeholder="Website ID"
              value={websiteId}
              onChange={(e) => setWebsiteId(e.target.value)}
              className="col-span-4 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            />
          </div>

          <div className="col-span-4 grid grid-cols-subgrid gap-2">
            <div className="flex items-center gap-2 col-span-2">
              <label htmlFor="analytics-enabled" className="text-sm font-medium text-foreground">
                Analytics Script
              </label>
            </div>
            <input
              type="checkbox"
              id="analytics-enabled"
              className="col-span-2 self-center justify-self-end w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2 transition-colors"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
            />
            <div className="col-span-4">
              <p className="text-muted-foreground/70 text-xs">
                Enable or disable the analytics script
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-4 h-px bg-border"></div>

        <h2 className="text-lg font-semibold col-span-4 text-foreground">Tracking Options</h2>

        {Object.entries(trackingOptions).map(([key, options], index) => (
          <div key={key} className="col-span-4 grid grid-cols-subgrid gap-4">
            <div className="col-span-4 grid grid-cols-subgrid gap-2">
              <div className="flex items-center gap-2 col-span-2">
                <h2 className="text-sm font-extrabold text-foreground">
                  {formatSectionTitle(key)}
                </h2>
              </div>
              <div className="col-span-2"></div>
              <div className="col-span-4">
                <p className="text-muted-foreground/70 text-xs">
                  Configure {formatSectionTitle(key).toLowerCase()} tracking settings
                </p>
              </div>
            </div>

            {options.map((option: TrackingFieldsI) => (
              <div key={option.id} className="col-span-4 grid grid-cols-subgrid gap-2">
                <div className="flex items-center gap-2 col-span-2">
                  <label htmlFor={option.id} className="text-sm font-medium text-foreground">
                    {option.label}
                  </label>
                </div>
                <input
                  type="checkbox"
                  id={option.id}
                  className="col-span-2 self-center justify-self-end w-4 h-4 text-primary bg-background border-input rounded focus:ring-ring focus:ring-2 transition-colors"
                  checked={settings[option.id]}
                  onChange={(e) => handleSettingChange(option.id, e.target.checked)}
                />
                <div className="col-span-4">
                  <p className="text-muted-foreground/70 text-xs">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}

            {index < Object.entries(trackingOptions).length - 1 && (
              <div className="col-span-4 h-px bg-border my-2" />
            )}
          </div>
        ))}

        <div className="col-span-4 h-px bg-border" />

        <div className="col-span-4 flex justify-center items-center mb-5">
          <p className="text-xs text-muted-foreground/70 text-center">
            © {new Date().getFullYear() === 2025 ? "2025" : `2025 - ${new Date().getFullYear()}`} Databuddy Analytics, Inc. All rights reserved.
          </p>
        </div>
        <div className="col-span-4 h-px bg-none" />
      </div>
    </main>
  );
}
