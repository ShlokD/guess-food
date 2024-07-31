import { MODES } from "./types";

export const MEAL_URL = "https://www.themealdb.com/api/json/v1/1/random.php";
export const CONFIGS: Record<MODES, { random: number }> = {
  [MODES.EASY]: {
    random: 0.5,
  },
  [MODES.MEDIUM]: {
    random: 0.25,
  },
  [MODES.HARD]: {
    random: 0,
  },
};
