export default function CookbookPage() {
  return (
    <section className="big-al-page space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Cookbook</p>
        <h1 className="text-4xl font-black tracking-tight text-gravy">What should I cook?</h1>
        <p className="text-base text-gravy/75">Recipes saved by the Restaurant will live here.</p>
      </div>

      <div className="big-al-card p-5">
        <h2 className="text-lg font-bold text-gravy">MVP scope</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gravy/75">
          <li>Search</li>
          <li>Recipe Books</li>
          <li>Recently Added</li>
          <li>All Recipes</li>
          <li>Needs Review</li>
        </ul>
      </div>
    </section>
  );
}
