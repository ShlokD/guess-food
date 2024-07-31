export enum SCREENS {
  HOME,
  PLAY,
}

export enum MODES {
  EASY,
  MEDIUM,
  HARD,
}

export type Recipe = {
  title: string;
  category: string;
  ingredients: string[];
  image: string;
};
