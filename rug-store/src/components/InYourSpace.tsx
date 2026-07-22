import KilimDivider from './KilimDivider';
import ScrollReveal from './ScrollReveal';
import { IMAGES } from '../images';

// IMPROVEMENT_PROMPT.md §3.4 / §2.4 shots #11-#12. Real lifestyle/interior
// photography wasn't generated this pass (Canva quota exhausted) — using
// existing product shots as a placeholder stand-in rather than silently
// reusing them in a way that misrepresents them as something else. Swap
// `TODO_PHOTO_11` / `TODO_PHOTO_12` for the real interior shots first.
const rows = [
  {
    image: IMAGES.foldedRug, // TODO_PHOTO_11: sunlit living room, daylight
    reverse: false,
    title: 'Утренний свет',
    body: 'Ковёр на полу гостиной, где текстура шерсти встречает мягкий дневной свет — узел за узлом становится видимым только вблизи.',
  },
  {
    image: IMAGES.rolledRug, // TODO_PHOTO_12: bedroom/reading nook, evening
    reverse: true,
    title: 'Вечерняя тишина',
    body: 'В спальне или уголке для чтения — тёплый свет вечера подчёркивает глубину природных красителей, а шерсть держит тепло под ногами.',
  },
];

export default function InYourSpace() {
  return (
    <section className="bg-wool px-6 md:px-12 py-24 md:py-48">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-coffee mb-2">В вашем доме</h2>
        <p className="text-coffee/70 max-w-xl mb-4">
          Один и тот же ковёр — два совершенно разных дома.
        </p>
        <KilimDivider color="#B5432A" />

        <div className="mt-12 flex flex-col gap-16 md:gap-24">
          {rows.map((row) => (
            <div
              key={row.title}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                row.reverse ? 'md:[&>*:first-child]:order-2' : ''
              }`}
            >
              <ScrollReveal>
                <img
                  src={row.image}
                  alt=""
                  className="w-full aspect-[4/3] object-cover"
                />
              </ScrollReveal>
              <div>
                <h3 className="font-display text-2xl md:text-[40px] text-coffee mb-3">
                  {row.title}
                </h3>
                <p className="text-coffee/80 text-body-lg max-w-md">{row.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
