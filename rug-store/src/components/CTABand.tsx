import KilimDivider from './KilimDivider';

export default function CTABand() {
  return (
    <section className="bg-walnut text-wool px-6 md:px-12 py-24 text-center">
      <KilimDivider color="#B5432A" />
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="font-display text-4xl md:text-5xl mb-4">
          Bring the loom home.
        </h2>
        <p className="text-wool/70 mb-8">
          Free shipping on your first weave. Every piece comes with its
          maker's card.
        </p>
        <button className="bg-madder text-wool px-10 py-4 font-medium hover:bg-turmeric hover:text-walnut transition-colors">
          Shop the Collection
        </button>
      </div>
      <KilimDivider color="#B5432A" />
      <footer className="mt-16 text-wool/50 text-sm">Kilim &amp; Co. — hand-knotted, always.</footer>
    </section>
  );
}
