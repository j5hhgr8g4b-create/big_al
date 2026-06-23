export default function PantryPage() {
  return (
    <section className="big-al-page space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Pantry</p>
        <h1 className="text-4xl font-black tracking-tight text-gravy">What do I need to buy?</h1>
        <p className="text-base text-gravy/75">In the MVP, Pantry means Shopping List only.</p>
      </div>

      <div className="big-al-card p-5">
        <h2 className="text-lg font-bold text-gravy">Shopping list</h2>
        <p className="mt-2 text-sm text-gravy/70">Generated items, checkboxes, quantities, and manual add will live here.</p>
      </div>
    </section>
  );
}
