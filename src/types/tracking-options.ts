export interface TrackingFields {
  id: string;
  label: string;
  description: string;
  default: boolean;
}

export interface TrackingOptions<T> {
  coreTracking: T[];
  advancedFeatures: T[];
}
