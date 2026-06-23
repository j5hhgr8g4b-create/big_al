const specials = [
  'Tasting Platter',
  'Hidden Gems',
  'Most Planned This Week',
  'New Adaptations',
  'Big Al Recommends',
  'Sausage Approved'
];

export default function SpecialsPage() {
  return (
    <section className="big-al-page space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-tomato">Specials</p>
        <h1 className="text-4xl font-black tracking-tight text-gravy">Good ideas, not noise.</h1>
        <p className="text-base text-gravy/75">Recipe discovery without followers, likes, or influencer mechanics.</p>
      </div>

      <div className="grid gap-3">
        {specials.map((special) => (
          <div key={special} className="big-al-card p-4 text-sm font-bold text-gravy">
            {special}
          </div>
        ))}
      </div>
    </section>
  );
}
