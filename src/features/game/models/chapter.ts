import type { Choice } from "./choice";


export interface Chapter {
    id: string;
    title: string;
    text: string;
    choices: Choice[];
  }