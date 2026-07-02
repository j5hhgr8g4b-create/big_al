"use client";

import { useState } from "react";

import { discardImport } from "@/app/(app)/cookbook/imports/actions";
import { saveRecipe } from "@/app/(app)/cookbook/recipes/actions";
import { SubmitButton } from "@/components/submit-button";

type IngredientInput = {
  name: string;
  preparation: string;
  quantity: string;
  unit: string;
};

type RecipeFormValue = {
  cookMinutes: string;
  creatorSource?: string;
  description: string;
  difficulty: string;
  imageUrl: string;
  ingredients: IngredientInput[];
  prepMinutes: string;
  servings: string;
  sourceUrl: string;
  sourceSite?: string;
  steps: string[];
  title: string;
  totalMinutes?: string;
};

type RecipeFormProps = {
  importId?: string;
  initialValue?: RecipeFormValue;
  mode?: "default" | "importReview";
  recipeId?: string;
  restaurantId: string;
};

type IngredientRow = IngredientInput & { key: string };
type StepRow = { instruction: string; key: string };

const emptyIngredient: IngredientInput = {
  name: "",
  preparation: "",
  quantity: "",
  unit: "",
};

const emptyValue: RecipeFormValue = {
  cookMinutes: "",
  description: "",
  difficulty: "",
  imageUrl: "",
  ingredients: [emptyIngredient],
  prepMinutes: "",
  servings: "",
  sourceUrl: "",
  steps: [""],
  title: "",
};

const inputClassName =
  "input-control mt-2 px-4 py-3 text-base";

export function RecipeForm({
  importId,
  initialValue = emptyValue,
  mode = "default",
  recipeId,
  restaurantId,
}: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    initialValue.ingredients.map((ingredient, index) => ({
      ...ingredient,
      key: `ingredient-${index}`,
    })),
  );
  const [steps, setSteps] = useState<StepRow[]>(
    initialValue.steps.map((instruction, index) => ({ instruction, key: `step-${index}` })),
  );

  function updateIngredient(index: number, field: keyof IngredientInput, value: string) {
    setIngredients((current) =>
      current.map((ingredient, itemIndex) =>
        itemIndex === index ? { ...ingredient, [field]: value } : ingredient,
      ),
    );
  }

  return (
    <form action={saveRecipe} className="mt-8 space-y-8">
      <input type="hidden" name="restaurantId" value={restaurantId} />
      <input type="hidden" name="recipeId" value={recipeId ?? ""} />
      <input type="hidden" name="importId" value={importId ?? ""} />

      <section className="visual-card space-y-5 p-6">
        <h2 className="section-kicker text-xl">Recipe details</h2>
        <label className="block text-sm font-medium">
          Title
          <input
            className={inputClassName}
            name="title"
            type="text"
            maxLength={160}
            defaultValue={initialValue.title}
            required
          />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea
            className={`${inputClassName} min-h-24 resize-y`}
            name="description"
            defaultValue={initialValue.description}
          />
        </label>
        <label className="block text-sm font-medium">
          Creator/source
          <input
            className={inputClassName}
            name="creatorSource"
            type="text"
            maxLength={160}
            defaultValue={initialValue.creatorSource ?? ""}
            placeholder="Author, publication or website"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Prep minutes
            <input
              className={inputClassName}
              name="prepMinutes"
              type="number"
              min="0"
              defaultValue={initialValue.prepMinutes}
            />
          </label>
          <label className="block text-sm font-medium">
            Cook minutes
            <input
              className={inputClassName}
              name="cookMinutes"
              type="number"
              min="0"
              defaultValue={initialValue.cookMinutes}
            />
          </label>
          <label className="block text-sm font-medium">
            Servings
            <input
              className={inputClassName}
              name="servings"
              type={mode === "importReview" ? "text" : "number"}
              min={mode === "importReview" ? undefined : "0.01"}
              step={mode === "importReview" ? undefined : "0.01"}
              defaultValue={initialValue.servings}
              placeholder={mode === "importReview" ? "Serves 4" : undefined}
            />
          </label>
          {mode === "importReview" && (
            <label className="block text-sm font-medium">
              Total minutes
              <input
                className={inputClassName}
                name="totalMinutes"
                type="number"
                min="0"
                defaultValue={initialValue.totalMinutes ?? ""}
              />
            </label>
          )}
          <label className="block text-sm font-medium">
            Difficulty
            <select className={inputClassName} name="difficulty" defaultValue={initialValue.difficulty}>
              <option value="">Not set</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Image URL
          <input
            className={inputClassName}
            name="imageUrl"
            type="url"
            defaultValue={initialValue.imageUrl}
          />
        </label>
        <label className="block text-sm font-medium">
          Source URL
          <input
            className={inputClassName}
            name="sourceUrl"
            type="url"
            defaultValue={initialValue.sourceUrl}
          />
        </label>
        <label className="block text-sm font-medium">
          Source site
          <input
            className={inputClassName}
            name="sourceSite"
            type="text"
            maxLength={160}
            defaultValue={initialValue.sourceSite ?? ""}
            placeholder="Website or publisher"
          />
        </label>
      </section>

      {mode === "importReview" ? (
        <section className="visual-card p-6">
          <h2 className="section-kicker text-xl">Ingredients</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            One ingredient per line. Keep the wording from the source unless you need to fix it.
          </p>
          <textarea
            className={`${inputClassName} min-h-64 resize-y leading-6`}
            name="ingredientLines"
            defaultValue={initialValue.ingredients.map((ingredient) => ingredient.name).join("\n")}
            required
          />
        </section>
      ) : (
      <section className="visual-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="section-kicker text-xl">Ingredients</h2>
          <button
            type="button"
            onClick={() =>
              setIngredients((current) => [
                ...current,
                { ...emptyIngredient, key: globalThis.crypto.randomUUID() },
              ])
            }
            className="btn-secondary min-h-0 px-3 py-2 text-xs"
          >
            Add ingredient
          </button>
        </div>
        <div className="mt-5 space-y-5">
          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.key}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Ingredient {index + 1}</p>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="text-xs font-semibold text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <label className="mt-3 block text-sm font-medium">
                Name
                <input
                  className={inputClassName}
                  name="ingredientName"
                  value={ingredient.name}
                  onChange={(event) => updateIngredient(index, "name", event.target.value)}
                  maxLength={120}
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="mt-3 block text-sm font-medium">
                  Quantity
                  <input
                    className={inputClassName}
                    name="ingredientQuantity"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={ingredient.quantity}
                    onChange={(event) => updateIngredient(index, "quantity", event.target.value)}
                  />
                </label>
                <label className="mt-3 block text-sm font-medium">
                  Unit
                  <input
                    className={inputClassName}
                    name="ingredientUnit"
                    value={ingredient.unit}
                    onChange={(event) => updateIngredient(index, "unit", event.target.value)}
                    maxLength={40}
                    placeholder="g, tbsp, each"
                  />
                </label>
              </div>
              <label className="mt-3 block text-sm font-medium">
                Preparation
                <input
                  className={inputClassName}
                  name="ingredientPreparation"
                  value={ingredient.preparation}
                  onChange={(event) => updateIngredient(index, "preparation", event.target.value)}
                  maxLength={120}
                  placeholder="finely chopped"
                />
              </label>
            </div>
          ))}
        </div>
      </section>
      )}

      {mode === "importReview" ? (
        <section className="visual-card p-6">
          <h2 className="section-kicker text-xl">Method</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            One step per line. Big Al will keep the order when it saves the recipe.
          </p>
          <textarea
            className={`${inputClassName} min-h-72 resize-y leading-6`}
            name="stepLines"
            defaultValue={initialValue.steps.join("\n")}
            required
          />
        </section>
      ) : (
      <section className="visual-card p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="section-kicker text-xl">Method</h2>
          <button
            type="button"
            onClick={() =>
              setSteps((current) => [
                ...current,
                { instruction: "", key: globalThis.crypto.randomUUID() },
              ])
            }
            className="btn-secondary min-h-0 px-3 py-2 text-xs"
          >
            Add step
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Step {index + 1}</p>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                    className="text-xs font-semibold text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                className={`${inputClassName} min-h-28 resize-y`}
                name="stepInstruction"
                value={step.instruction}
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, instruction: event.target.value } : item,
                    ),
                  )
                }
                maxLength={2000}
                required
              />
            </div>
          ))}
        </div>
      </section>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <SubmitButton pendingLabel="Saving recipe…">Save recipe</SubmitButton>
        {mode === "importReview" && importId && (
          <button
            type="submit"
            formAction={discardImport}
            formNoValidate
            className="btn-danger"
          >
            Discard import
          </button>
        )}
      </div>
    </form>
  );
}
