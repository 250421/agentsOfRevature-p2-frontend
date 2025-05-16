import type { Choice } from "./option";


export interface Scenario {
    id: string;
    title: string;
    text: string;
    choices: Choice[];
  }