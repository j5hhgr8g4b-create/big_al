export const feedbackCategories = [
  { label: "Something did not work", value: "problem" },
  { label: "Something was confusing", value: "confusing" },
  { label: "Recipe information was wrong", value: "recipe" },
  { label: "I expected something different", value: "expected" },
  { label: "General feedback", value: "general" },
] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number]["value"];

const feedbackCategoryValues = new Set<string>(
  feedbackCategories.map((category) => category.value),
);

export function validateFeedbackCategory(value: string): FeedbackCategory | null {
  return feedbackCategoryValues.has(value) ? (value as FeedbackCategory) : null;
}

export function normalizeFeedbackPagePath(value: string) {
  const path = value.trim();
  return path.length >= 1 && path.length <= 300 && path.startsWith("/") && !path.startsWith("//")
    ? path
    : "/";
}

export function validateFeedbackText(value: string) {
  const text = value.trim();
  return text.length >= 10 && text.length <= 4000 ? text : null;
}
