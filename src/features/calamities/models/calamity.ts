import type { SeverityLevel } from "./data";

export interface Calamity {
    id: number,
    location: string;
    severity: SeverityLevel;
    description: string;
  }
