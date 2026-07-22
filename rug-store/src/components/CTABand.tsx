import KilimDivider from './KilimDivider';

export default function CTABand() {
  return (
    <section className="bg-walnut text-wool px-6 md:px-12 py-24 text-center">
      <KilimDivider color="#B5432A" />
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="font-display text-display-md md:text-display-lg mb-4">
          Принесите станок домой.
        </h2>
        <p className="text-wool/70 mb-8">
          Бесплатная доставка первого ковра. Каждое изделие — с карточкой
          мастера.
        </p>
        <button className="bg-madder text-wool px-10 py-4 font-medium hover:bg-turmeric hover:text-walnut transition-colors">
          Выбрать ковёр
        </button>
      </div>
      <KilimDivider color="#B5432A" />
      <footer className="mt-16 text-wool/50 text-sm">Килим и Ко — только ручная работа.</footer>
    </section>
  );
}
