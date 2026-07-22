import KilimDivider from './KilimDivider';
import ScrollReveal from './ScrollReveal';
import { IMAGES } from '../images';

const specs = [
  {
    label: 'Размер',
    body: 'Шаг 5 см, до 400 × 600 см — под конкретную стену, а не под ближайшую строку в таблице.',
  },
  {
    label: 'Цвет',
    body: 'Красим партию шерсти под ваш образец: доска пола, ткань дивана, кусок обоев. Тот же узор — другой характер.',
  },
  {
    label: 'Плотность узла',
    body: 'От 6 000 до 12 000 узлов/дм² — гуще узел, четче линия рисунка, дольше срок на станке.',
  },
  {
    label: 'Мастер',
    body: 'Один ткач ведёт ваш ковёр от первого ряда до последнего — не бригада, не конвейер.',
  },
];

export default function Bespoke() {
  return (
    <section id="bespoke" className="bg-coffee text-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-display-sm md:text-display-md mb-2">На заказ</h2>
        <p className="text-wool/70 max-w-xl mb-4">
          Таблица размеров подходит не каждой комнате. Если ваша — нет, мы ткём под неё отдельно.
        </p>
        <KilimDivider color="#B5432A" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <img
              src={IMAGES.loomCraft}
              alt="Ткач завязывает узлы под индивидуальный заказ на станке"
              className="w-full aspect-[4/3] object-cover"
            />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {specs.map((s, i) => (
              <ScrollReveal key={s.label} delayMs={120 + i * 80}>
                <div className="text-label uppercase text-turmeric">{s.label}</div>
                <p className="text-wool/80 text-body-sm mt-2">{s.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delayMs={420} className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <p className="text-wool/80 text-body-lg max-w-md">
            Заявка начинается с эскиза на бумаге, не с корзины. Ответим в течение двух рабочих дней.
          </p>
          <button className="woven-sweep bg-madder text-wool px-8 py-3 font-medium shrink-0">
            Обсудить эскиз
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
