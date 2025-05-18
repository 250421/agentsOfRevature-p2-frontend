import type { SeverityLevel } from "./data";

export interface Calamity {
    id: number,
    title: string,
    location: string;
    severity: SeverityLevel;
    description: string;
    reported: string,
  }
