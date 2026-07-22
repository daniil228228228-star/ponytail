import KilimDivider from './KilimDivider';
import { IMAGES } from '../images';

const steps = [
  { n: '01', title: 'Raw wool', body: 'Sheared, sorted by grade, hand-washed in river water.' },
  { n: '02', title: 'Natural dye', body: 'Madder root, indigo, weld — no synthetic pigment.' },
  { n: '03', title: 'The loom', body: 'Warp strung by hand, tension set and checked daily.' },
  { n: '04', title: 'The knot', body: 'Symmetric or asymmetric, one row at a time, for months.' },
];

export default function Craft() {
  return (
    <section id="craft" className="bg-coffee text-wool px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-2">The Craft</h2>
        <p className="text-wool/70 max-w-xl mb-4">
          A real sequence, start to finish — this is the one place on this page
          numbers earn their keep.
        </p>
        <KilimDivider color="#D9A441" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src={IMAGES.loomCraft}
            alt="Hand-knotting wool on a traditional loom"
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
