export interface Section {
  title: string;
  items: string[];
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface ProgressState {
  [key: string]: boolean; // item full text as key, boolean as value
}