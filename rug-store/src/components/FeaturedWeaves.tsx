import KilimDivider from './KilimDivider';
import { IMAGES } from '../images';

const weaves = [
  {
    image: IMAGES.foldedRug,
    detail: IMAGES.heroTexture,
    name: 'Bakhtiari Diamond',
    meta: 'Zagros wool · 9,600 knots/dm² · hand-spun',
    size: 'large' as const,
  },
  {
    image: IMAGES.rolledRug,
    detail: IMAGES.loomCraft,
    name: 'Ochre Chevron',
    meta: 'Anatolian wool · natural indigo + weld dye',
    size: 'small' as const,
  },
  {
    image: IMAGES.loomCraft,
    detail: IMAGES.foldedRug,
    name: 'Madder Lattice',
    meta: 'Kurdish wool · single-warp, symmetric knot',
    size: 'small' as const,
  },
];

function Tile({ w }: { w: (typeof weaves)[number] }) {
  return (
    <div
      className={`group relative overflow-hidden ${
        w.size === 'large' ? 'aspect-[4/5] md:aspect-auto md:row-span-2' : 'aspect-square'
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
        <h2 className="font-display text-3xl md:text-4xl text-coffee mb-2">Featured Weaves</h2>
        <p className="text-coffee/70 max-w-xl mb-4">
          Each piece named for its pattern and origin — not a SKU.
        </p>
        <KilimDivider />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[calc((100vw-6rem)/3/1.5)]">
          {weaves.map((w) => (
            <Tile key={w.name} w={w} />
          ))}
        </div>
      </div>
    </section>
  );
}
