const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-lg px-6 py-6 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Логотип (Фильтры удалены, теперь цвет оригинальный) */}
        <div className="flex items-center">
          <a href="/" className="transition-opacity hover:opacity-70">
            <img src="/logo.png" alt="Logo" className="h-8 sm:h-10 object-contain" />
          </a>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <a href="/" className="text-[10px] sm:text-xs font-semibold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors">EXPLORE</a>
          <a href="/web3-projects" className="text-[10px] sm:text-xs font-semibold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors">WEB3 PROJECTS</a>
          <a href="/watchlist" className="text-[10px] sm:text-xs font-semibold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors">WATCHLIST</a>
        </div>

        <div className="hidden sm:block w-[60px]"></div>
      </div>
    </nav>
  );
};

export default Navbar;