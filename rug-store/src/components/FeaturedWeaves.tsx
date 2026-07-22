import KilimDivider from './KilimDivider';
import { IMAGES } from '../images';

const weaves = [
  {
    image: IMAGES.foldedRug,
    detail: IMAGES.heroTexture,
    name: 'Бахтияри Ромб',
    meta: 'Шерсть Загроса · 9 600 узлов/дм² · ручное прядение',
    size: 'large' as const,
  },
  {
    image: IMAGES.rolledRug,
    detail: IMAGES.foldedRug,
    name: 'Охра Шеврон',
    meta: 'Анатолийская шерсть · природный индиго и вайда',
    size: 'small' as const,
  },
  {
    image: IMAGES.heroTexture,
    detail: IMAGES.rolledRug,
    name: 'Марена Решётка',
    meta: 'Курдская шерсть · одинарная основа, симметричный узел',
    size: 'small' as const,
  },
];

function Tile({ w }: { w: (typeof weaves)[number] }) {
  return (
    <div
      className={`group relative overflow-hidden ${
        w.size === 'large' ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square'
      }`}
    >
      <img
        src={w.image}
        alt={w.name}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
      />
      <img
        src={w.detail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-walnut/80 to-transparent p-5">
        <div className="font-display text-wool text-xl">{w.name}</div>
        <div className="text-wool/70 text-sm mt-1">{w.meta}</div>
      </div>
    </div>
  );
}

export default function FeaturedWeaves() {
  return (
    <section id="weaves" className="bg-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-coffee mb-2">Избранные ковры</h2>
        <p className="text-coffee/70 max-w-xl mb-4">
          Каждое изделие названо по узору и происхождению — не по артикулу.
        </p>
        <KilimDivider />
        {/* fixed aspect-ratios per tile instead of a viewport-width calc —
            robust at any screen size, no risk of the row height drifting
            out of sync with the container's actual (max-w-capped) width */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {weaves.map((w) => (
            <Tile key={w.name} w={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
