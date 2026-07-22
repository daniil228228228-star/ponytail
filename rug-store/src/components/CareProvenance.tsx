import KilimDivider from './KilimDivider';

export default function CareProvenance() {
  return (
    <section id="care" className="bg-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <KilimDivider color="#7A8B6F" />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl text-coffee mb-4">Care</h2>
            <ul className="space-y-3 text-coffee/80">
              <li>Vacuum with suction only — no beater bar, it snaps knots.</li>
              <li>Rotate 180° every six months for even wear.</li>
              <li>Spot clean with cold water and wool-safe soap only.</li>
              <li>Professional wash every 3–5 years, not more.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-coffee mb-4">Provenance</h2>
            <p className="text-coffee/80">
              Every rug ships with a maker's card: region, workshop, wool
              source, and approximate knot count. We work directly with three
              weaving cooperatives — no anonymous middle-market sourcing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
