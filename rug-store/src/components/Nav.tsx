export default function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-6 flex items-center justify-between text-wool">
      <span className="font-display text-2xl tracking-tight">Килим и Ко</span>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        <a href="#weaves" className="hover:text-turmeric transition-colors">
          Коллекция
        </a>
        <a href="#craft" className="hover:text-turmeric transition-colors">
          Ремесло
        </a>
        <a href="#care" className="hover:text-turmeric transition-colors">
          Уход
        </a>
      </nav>
      <button className="bg-wool text-walnut px-5 py-2 text-sm font-medium hover:bg-turmeric transition-colors">
        Выбрать ковёр
      </button>
    </header>
  );
}
