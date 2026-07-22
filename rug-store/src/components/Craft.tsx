import KilimDivider from './KilimDivider';
import { IMAGES } from '../images';

const steps = [
  { n: '01', title: 'Сырая шерсть', body: 'Стрижка, сортировка по качеству, ручная промывка в речной воде.' },
  { n: '02', title: 'Натуральный краситель', body: 'Корень марены, индиго, вайда — никаких синтетических пигментов.' },
  { n: '03', title: 'Станок', body: 'Основа натянута вручную, натяжение проверяется каждый день.' },
  { n: '04', title: 'Узел', body: 'Симметричный или асимметричный, ряд за рядом, месяцами.' },
];

export default function Craft() {
  return (
    <section id="craft" className="bg-coffee text-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-2">Наше ремесло</h2>
        <p className="text-wool/70 max-w-xl mb-4">
          Реальная последовательность от начала до конца — единственное место
          на странице, где нумерация оправдана.
        </p>
        <KilimDivider color="#D9A441" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src={IMAGES.loomCraft}
            alt="Ручное завязывание шерстяных узлов на традиционном станке"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="font-display text-turmeric text-sm tracking-widest">{s.n}</div>
                <div className="font-display text-xl mt-1">{s.title}</div>
                <p className="text-wool/70 text-sm mt-1">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
