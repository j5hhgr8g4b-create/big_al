import Link from "next/link";

import { submitBetaFeedback } from "@/app/(app)/feedback/actions";
import { SectionIntro } from "@/components/section-intro";
import { SubmitButton } from "@/components/submit-button";
import { feedbackCategories, normalizeFeedbackPagePath } from "@/lib/beta/feedback";
import { getCurrentRestaurant } from "@/lib/restaurants/current";

type FeedbackPageProps = {
  searchParams: Promise<{ error?: string; from?: string; sent?: string }>;
};

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const { error, from, sent } = await searchParams;
  const pagePath = normalizeFeedbackPagePath(from ?? "/");
  const { restaurant } = await getCurrentRestaurant();

  return (
    <>
      <SectionIntro
        eyebrow="Private beta"
        title="Send feedback"
        description="Tell Alex what broke, what felt confusing, or what you expected to happen. A few practical details are much more useful than polished wording."
      />

      {sent === "yes" && (
        <section className="note-card mt-8 p-6" role="status">
          <h2 className="text-xl font-semibold">Thank you — feedback sent.</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            It includes the area you came from so Alex can investigate.
          </p>
          <Link href={pagePath} className="btn-secondary mt-4 min-h-0 px-3 py-2 text-xs">
            Go back
          </Link>
        </section>
      )}

      {error && (
        <p role="alert" className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {!restaurant ? (
        <section className="warm-section mt-8 border-dashed p-8 text-center">
          <h2 className="text-xl font-semibold">Create your Restaurant first</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Feedback is kept with your private Restaurant so it has the right context.
          </p>
          <Link href="/restaurants/new" className="btn-primary mt-4">
            Create Restaurant
          </Link>
        </section>
      ) : sent !== "yes" ? (
        <form action={submitBetaFeedback} className="visual-card mt-8 p-6">
          <input type="hidden" name="pagePath" value={pagePath} />
          <label className="block text-sm font-semibold">
            What kind of feedback is this?
            <select name="category" required defaultValue="" className="input-control mt-2 px-4 py-3 text-sm">
              <option value="" disabled>Choose one</option>
              {feedbackCategories.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </label>
          <label className="mt-5 block text-sm font-semibold">
            What happened?
            <textarea
              name="feedback"
              required
              minLength={10}
              maxLength={4000}
              rows={7}
              placeholder="What were you trying to do, and what happened instead?"
              className="input-control mt-2 px-4 py-3 text-sm"
            />
          </label>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
            Sent from {pagePath}. Your account, Restaurant and submission time are added automatically. Do not include passwords or other secrets.
          </p>
          <div className="mt-5">
            <SubmitButton pendingLabel="Sending…">Send feedback</SubmitButton>
          </div>
        </form>
      ) : null}
    </>
  );
}
