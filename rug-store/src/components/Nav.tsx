export default function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 pt-6 flex items-center justify-between text-wool">
      <span className="font-display text-2xl tracking-tight">Килим и Ко</span>
      <nav className="hidden md:flex items-center gap-8 text-sm">
        <a href="#weaves" className="nav-underline">
          Коллекция
        </a>
        <a href="#craft" className="nav-underline">
          Ремесло
        </a>
        <a href="#care" className="nav-underline">
          Уход
        </a>
      </nav>
      <button className="woven-sweep woven-sweep-dark bg-wool text-walnut px-5 py-2 text-sm font-medium">
        Выбрать ковёр
      </button>
    </header>
  );
}
