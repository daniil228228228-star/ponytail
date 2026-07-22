import KilimDivider from './KilimDivider';

export default function CareProvenance() {
  return (
    <section id="care" className="bg-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <KilimDivider color="#7A8B6F" />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-display-sm text-coffee mb-4">Уход</h2>
            <ul className="space-y-3 text-coffee/80">
              <li>Пылесосьте только всасыванием — без вращающейся щётки, она рвёт узлы.</li>
              <li>Переворачивайте на 180° раз в полгода для равномерного износа.</li>
              <li>Локальная чистка только холодной водой и мылом для шерсти.</li>
              <li>Профессиональная стирка раз в 3–5 лет, не чаще.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-display-sm text-coffee mb-4">Происхождение</h2>
            <p className="text-coffee/80">
              К каждому ковру прилагается карточка мастера: регион, мастерская,
              источник шерсти и приблизительное число узлов. Мы работаем
              напрямую с тремя ткацкими кооперативами — никаких анонимных
              посредников.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
