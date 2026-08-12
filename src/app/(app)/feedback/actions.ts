"use server";

import { redirect } from "next/navigation";

import {
  normalizeFeedbackPagePath,
  validateFeedbackCategory,
  validateFeedbackText,
} from "@/lib/beta/feedback";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function feedbackRedirect(params: Record<string, string>): never {
  redirect(`/feedback?${new URLSearchParams(params).toString()}`);
}

export async function submitBetaFeedback(formData: FormData) {
  const category = validateFeedbackCategory(field(formData, "category"));
  const feedbackText = validateFeedbackText(field(formData, "feedback"));
  const pagePath = normalizeFeedbackPagePath(field(formData, "pagePath"));

  if (!category) {
    feedbackRedirect({ error: "Choose the kind of feedback you want to send.", from: pagePath });
  }

  if (!feedbackText) {
    feedbackRedirect({ error: "Write between 10 and 4000 characters so we have enough detail to help.", from: pagePath });
  }

  const { restaurant, supabase } = await getCurrentRestaurant();
  if (!restaurant) {
    feedbackRedirect({ error: "Create your Restaurant before sending beta feedback.", from: pagePath });
  }

  const { error } = await supabase.rpc("submit_beta_feedback", {
    target_restaurant_id: restaurant.id,
    feedback_category: category,
    feedback_page_path: pagePath,
    feedback_text_value: feedbackText,
  });

  if (error) {
    console.warn("[beta-feedback] submission failed", {
      code: error.code,
      restaurantId: restaurant.id,
    });
    feedbackRedirect({ error: "Big Al could not send that feedback. Please try again.", from: pagePath });
  }

  console.info("[beta-feedback] submitted", {
    category,
    pagePath,
    restaurantId: restaurant.id,
  });
  feedbackRedirect({ from: pagePath, sent: "yes" });
}
