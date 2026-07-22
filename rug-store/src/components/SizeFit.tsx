import KilimDivider from './KilimDivider';

// IMPROVEMENT_PROMPT.md §3.5 — utility, not spectacle. One divider at the
// top, otherwise quiet: no scroll choreography, no hover flourishes.
const sizes = [
  { name: 'Раннер', cm: '80 × 300 см', inch: '31 × 118 in' },
  { name: 'Малый', cm: '120 × 180 см', inch: '47 × 71 in' },
  { name: 'Средний', cm: '160 × 230 см', inch: '63 × 91 in' },
  { name: 'Большой', cm: '200 × 300 см', inch: '79 × 118 in' },
  { name: 'Комнатный', cm: '250 × 350 см', inch: '98 × 138 in' },
];

function FitDiagram({
  label,
  variant,
}: {
  label: string;
  variant: 'under-all' | 'under-front' | 'runner';
}) {
  return (
    <div>
      <svg viewBox="0 0 160 110" className="w-full h-auto" aria-hidden="true">
        <rect x="4" y="4" width="152" height="102" fill="none" stroke="#3A2E27" strokeOpacity="0.25" strokeWidth="1.5" />
        {variant === 'under-all' && (
          <>
            <rect x="20" y="20" width="120" height="70" fill="#B5432A" fillOpacity="0.18" stroke="#B5432A" strokeWidth="1.5" />
            <rect x="35" y="35" width="30" height="18" fill="none" stroke="#3A2E27" strokeWidth="1.5" />
            <rect x="95" y="35" width="30" height="18" fill="none" stroke="#3A2E27" strokeWidth="1.5" />
          </>
        )}
        {variant === 'under-front' && (
          <>
            <rect x="20" y="45" width="120" height="45" fill="#B5432A" fillOpacity="0.18" stroke="#B5432A" strokeWidth="1.5" />
            <rect x="35" y="20" width="30" height="35" fill="none" stroke="#3A2E27" strokeWidth="1.5" />
            <rect x="95" y="20" width="30" height="35" fill="none" stroke="#3A2E27" strokeWidth="1.5" />
          </>
        )}
        {variant === 'runner' && (
          <rect x="60" y="10" width="40" height="90" fill="#B5432A" fillOpacity="0.18" stroke="#B5432A" strokeWidth="1.5" />
        )}
      </svg>
      <p className="text-body-sm text-coffee/70 mt-2 text-center">{label}</p>
    </div>
  );
}

export default function SizeFit() {
  return (
    <section className="bg-wool px-6 md:px-12 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-display-sm md:text-display-md text-coffee mb-2">Размеры и подбор</h2>
        <p className="text-coffee/70 max-w-xl mb-4">
          Большинство людей берут ковёр на размер меньше, чем нужно — оставляйте
          не менее 45 см голого пола со всех сторон.
        </p>
        <KilimDivider color="#7A8B6F" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
          <FitDiagram label="Под всей мебелью" variant="under-all" />
          <FitDiagram label="Под передними ножками" variant="under-front" />
          <FitDiagram label="Раннер в коридоре" variant="runner" />
        </div>

        <table className="mt-12 w-full max-w-2xl border-collapse">
          <thead>
            <tr className="text-label uppercase text-coffee/50 border-b border-coffee/15">
              <th className="text-left font-normal py-3">Формат</th>
              <th className="text-left font-normal py-3">См</th>
              <th className="text-left font-normal py-3">Дюймы</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.name} className="border-b border-coffee/10 hover:bg-coffee/5">
                <td className="py-3 text-coffee">{s.name}</td>
                <td className="py-3 text-coffee/70">{s.cm}</td>
                <td className="py-3 text-coffee/70">{s.inch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
