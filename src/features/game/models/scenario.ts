import type { Option } from "./option";

export interface Scenario {
    id: string;
    title: string;
    text: string;
    choices: Option[];
  }