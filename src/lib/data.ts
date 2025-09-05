import type { TrackingFieldsI, TrackingOptionsI } from "../types/options";

export const trackingOptions: TrackingOptionsI<TrackingFieldsI> = {
  coreTracking: [
      {
        id: "enableTracking",
        label: "Enable Tracking",
        description:
          "Master switch to enable or disable all tracking features.",
        default: true,
      },
      {
        id: "pageViews",
        label: "Page Views",
        description: "Track when users visit different pages on your site.",
        default: true,
      },
      {
        id: "hashChanges",
        label: "Hash Changes",
        description:
          "Monitor changes in the URL hash for single-page applications.",
        default: false,
      },
      {
        id: "sessions",
        label: "Sessions",
        description:
          "Group user interactions into sessions for better analysis.",
        default: true,
      },
    ],
    interactionTracking: [
      {
        id: "interactions",
        label: "Interactions",
        description: "Track clicks and forms",
        default: false,
      },
      {
        id: "dataAttributes",
        label: "Data Attributes",
        description: "Track data-* attributes",
        default: false,
      },
      {
        id: "outboundLinks",
        label: "Outbound Links",
        description: "Track external link clicks",
        default: false,
      },
    ],
    engagementTracking: [
      {
        id: "engagement",
        label: "Engagement",
        description: "Track use engagement",
        default: false,
      },
      {
        id: "scrollDepth",
        label: "Scroll Depth",
        description: "Track scroll percentage",
        default: false,
      },
      {
        id: "exitIntent",
        label: "Exit Intent",
        description: "Track exit behavior",
        default: false,
      },
      {
        id: "bounceRate",
        label: "Bounce Rate",
        description: "Track bounce detection",
        default: false,
      },
    ],
    performanceTracking: [
      {
        id: "loadTimes",
        label: "Load Times",
        description: "Track page performance",
        default: true,
      },
      {
        id: "webVitals",
        label: "Web Vitals",
        description: "Track core web vitals",
        default: false,
      },
      {
        id: "errors",
        label: "Errors",
        description: "Track JavaScript errors",
        default: false,
      },
    ],
    optimization: [
      {
        id: "enablebatching",
        label: "Enable Batching",
        description: "Batch tracking events to reduce network requests",
        default: true,
      },
      {
        id: "enableRetries",
        label: "Enable Retries",
        description: "Retry failed requests",
        default: true,
      },
    ],
};
