import type {
  TrackingFields,
  TrackingOptions,
} from "../types/tracking-options";

export const trackingOptions: TrackingOptions<TrackingFields> = {
  coreTracking: [
    {
      id: "hashChanges",
      label: "Hash Changes",
      description: "Track URL hash changes for SPA routing",
      default: false,
    },
    {
      id: "dataAttributes",
      label: "Data Attributes",
      description: "Auto-track via data-track HTML attributes",
      default: false,
    },
    {
      id: "outboundLinks",
      label: "Outbound Links",
      description: "Track clicks to external sites",
      default: false,
    },
    {
      id: "interactions",
      label: "Interactions",
      description: "Track button clicks and form submissions",
      default: false,
    },
  ],
  advancedFeatures: [
    {
      id: "performance",
      label: "Performance",
      description: "Track page load and runtime performance",
      default: false,
    },
    {
      id: "webVitals",
      label: "Web Vitals",
      description: "Track Core Web Vitals (LCP, FID, CLS, INP)",
      default: false,
    },
    {
      id: "errors",
      label: "Error Tracking",
      description: "Capture JavaScript errors and exceptions",
      default: false,
    },
    {
      id: "scrollDepth",
      label: "Scroll Depth",
      description: "Track how far users scroll on pages",
      default: false,
    },
  ],
};
