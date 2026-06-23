export default function MenuPage() {
  return (
    <section className="big-al-page space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Menu</p>
        <h1 className="text-4xl font-black tracking-tight text-gravy">What are we eating?</h1>
        <p className="text-base text-gravy/75">Plan meals without turning dinner into admin.</p>
      </div>

      <div className="grid gap-4">
        <div className="big-al-card p-5">
          <h2 className="text-lg font-bold text-gravy">This Week</h2>
          <p className="mt-2 text-sm text-gravy/70">Meal planning cards will appear here.</p>
        </div>
        <div className="big-al-card p-5">
          <h2 className="text-lg font-bold text-gravy">Next Week</h2>
          <p className="mt-2 text-sm text-gravy/70">Future meals will appear here.</p>
        </div>
        <div className="big-al-card p-5">
          <h2 className="text-lg font-bold text-gravy">Unplanned</h2>
          <p className="mt-2 text-sm text-gravy/70">Ideas waiting for a day will appear here.</p>
        </div>
      </div>
    </section>
  );
}
