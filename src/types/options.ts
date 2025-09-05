
export interface TrackingFieldsI {
    id: string;
    label: string;
    description: string;
    default: boolean;
  }
  
  export interface TrackingOptionsI<T> {
    coreTracking: T[];
    interactionTracking: T[];
    engagementTracking: T[];
    performanceTracking: T[];
    optimization: T[];
  }
  