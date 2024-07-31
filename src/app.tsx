import { useRef, useState } from "preact/hooks";
import { CONFIGS, MEAL_URL } from "./consts";
import { MODES, Recipe, SCREENS } from "./types";

const Home = ({
  handleLevelSelect,
}: {
  handleLevelSelect: (level: MODES) => void;
}) => {
  return (
    <>
      <p className="text-lg text-center p-4">
        Making recipes from ingredients is easy. Try to guess the ingredients
        from the recipe
      </p>
      <div className="flex flex-col gap-12 my-8 w-full items-center justify-center">
        <button
          className="p-4 bg-blue-500 text-white shadow font-bold text-xl rounded-2xl w-2/3"
          onClick={() => handleLevelSelect(MODES.EASY)}>
          Easy
        </button>
        <button
          className="p-4 bg-blue-500 text-white shadow font-bold text-xl rounded-2xl w-2/3"
          onClick={() => handleLevelSelect(MODES.MEDIUM)}>
          Medium
        </button>
        <button
          className="p-4 bg-blue-500 text-white shadow font-bold text-xl rounded-2xl w-2/3"
          onClick={() => handleLevelSelect(MODES.HARD)}>
          Hard
        </button>
      </div>
    </>
  );
};

const Play = ({
  recipe,
  mode,
  goHome,
  fetchNewRecipe,
}: {
  recipe: Recipe | null;
  mode: MODES;
  goHome: () => void;
  fetchNewRecipe: () => void;
}) => {
  const random = CONFIGS?.[mode].random;

  const [guess, setGuess] = useState(
    new Array(recipe?.ingredients?.length || 0).fill(false).map(() => {
      return Math.random() < random;
    })
  );
  const [value, setValue] = useState("");
  const [end, setEnd] = useState(false);
  const [wrongGuess, setWrongGuess] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getNewRecipe = async () => {
    await fetchNewRecipe();
    setGuess(
      new Array(recipe?.ingredients?.length || 0).fill(false).map(() => {
        return Math.random() < random;
      })
    );
    setValue("");
    setEnd(false);
  };

  const checkIngredient = (value: string) => {
    if (value === "") {
      setValue("");
      return;
    }
    const foundIndex = recipe?.ingredients?.findIndex(
      (ing, i) => !guess[i] && ing.toLowerCase().includes(value.toLowerCase())
    );
    if (foundIndex !== undefined && foundIndex !== -1 && !guess[foundIndex]) {
      setGuess((prev) => {
        const newGuess = prev.slice();
        newGuess[foundIndex] = true;
        if (newGuess.every((g) => g)) {
          setEnd(true);
        }
        return newGuess;
      });
      setValue("");
    } else {
      setWrongGuess(true);
      setTimeout(() => {
        setWrongGuess(false);
        inputRef?.current?.focus();
        inputRef?.current?.select();
      }, 1000);
      setValue(value);
    }
  };
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex gap-4 my-4 w-full items-center justify-center">
        <button
          onClick={getNewRecipe}
          className="p-2 bg-blue-400 shadow rounded-xl text-white font-bold">
          New Recipe
        </button>
        <button
          onClick={() => setEnd(true)}
          className="p-2 bg-blue-400 shadow rounded-xl text-white font-bold">
          Give Up
        </button>
        <button
          onClick={goHome}
          className="p-2 bg-blue-400 shadow rounded-xl text-white font-bold">
          Return to Home
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:w-1/2 items-center gap-4">
          <h2 className="mt-4 text-3xl font-bold">{recipe?.title}</h2>
          <p className="italic">{recipe?.category}</p>
          <img
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full lg:w-2/3 h-100"
          />
        </div>
        <div className="flex flex-col items-center lg:w-1/2">
          <input
            value={value}
            ref={(ref) => (inputRef.current = ref)}
            disabled={end || wrongGuess}
            onChange={(ev) =>
              checkIngredient((ev?.target as HTMLInputElement).value)
            }
            className={`w-full p-4 lg:w-2/3 text-xl placeholder:text-sm border-4 my-4 ${
              wrongGuess ? "border-red-600" : "border-black"
            }`}
            placeholder="Type ingredient and press enter to check"
          />
          <div className="flex flex-wrap items-stretch justify-center w-full my-8 gap-4">
            {recipe?.ingredients.map((ingredient, i) => {
              const shouldShow = guess[i] || end;
              if (shouldShow) {
                return (
                  <p
                    key={`ingredient-${i}`}
                    className="w-1/3 p-4 bg-blue-500 rounded-xl font-bold">
                    {ingredient}
                  </p>
                );
              }
              return (
                <p
                  key={`ingredient-${i}`}
                  className="w-1/3 p-4 bg-white border-blue-500 border-2 italic text-gray-400 rounded-xl font-bold">
                  Guess
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const transformJSON = (json: any) => {
  const meal = json?.meals?.[0];
  const uniqIngredients = new Set([
    meal.strIngredient1,
    meal.strIngredient2,
    meal.strIngredient3,
    meal.strIngredient4,
    meal.strIngredient5,
    meal.strIngredient6,
    meal.strIngredient7,
    meal.strIngredient8,
    meal.strIngredient9,
    meal.strIngredient10,
    meal.strIngredient11,
    meal.strIngredient12,
    meal.strIngredient13,
    meal.strIngredient14,
    meal.strIngredient15,
    meal.strIngredient16,
    meal.strIngredient17,
    meal.strIngredient18,
    meal.strIngredient19,
    meal.strIngredient20,
  ]);
  return {
    title: meal.strMeal,
    category: meal.strCategory,
    ingredients: [...uniqIngredients].filter((s) => s?.length !== 0 && !!s),
    image: meal.strMealThumb,
  };
};
export function App() {
  const [mode, setMode] = useState(MODES.MEDIUM);
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const fetchNewRecipe = async () => {
    try {
      const res = await fetch(MEAL_URL);
      const json = await res.json();
      const recipe = transformJSON(json);
      setRecipe(recipe);
    } catch (_) {}
  };

  const onLevelSelect = async (level: MODES) => {
    await fetchNewRecipe();
    setMode(level);
    setScreen(SCREENS.PLAY);
  };

  const goHome = () => {
    setScreen(SCREENS.HOME);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="p-4 w-full bg-green-500">
        <h1 className="text-2xl text-center font-bold">Guess Food</h1>
      </header>
      <main className="p-2 flex flex-col w-full min-h-screen">
        {screen === SCREENS.HOME && <Home handleLevelSelect={onLevelSelect} />}
        {screen === SCREENS.PLAY && (
          <Play
            mode={mode}
            recipe={recipe}
            goHome={goHome}
            fetchNewRecipe={fetchNewRecipe}
          />
        )}
      </main>
    </div>
  );
}
