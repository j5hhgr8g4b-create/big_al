export default function KitchenPage() {
  return (
    <section className="big-al-page space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Kitchen</p>
        <h1 className="text-4xl font-black tracking-tight text-gravy">What should I do next?</h1>
        <p className="text-base text-gravy/75">A calm starting point for tonight&apos;s food, planning, shopping, and cooking.</p>
      </div>

      <div className="big-al-card p-5">
        <p className="text-sm font-semibold text-gravy/60">Tonight&apos;s meal</p>
        <h2 className="mt-2 text-2xl font-bold text-gravy">Nothing planned yet</h2>
        <p className="mt-2 text-sm text-gravy/70">Add something from the Cookbook or park it in Unplanned.</p>
      </div>

      <div className="grid gap-4">
        <div className="big-al-card p-5">
          <h2 className="text-lg font-bold text-gravy">Shopping status</h2>
          <p className="mt-2 text-sm text-gravy/70">Shopping list appears here once meals are planned.</p>
        </div>

        <div className="big-al-card p-5">
          <h2 className="text-lg font-bold text-gravy">Upcoming meals</h2>
          <p className="mt-2 text-sm text-gravy/70">Planned meals will show here.</p>
        </div>
      </div>
    </section>
  );
}
