import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight">
          drop<span className="text-primary">radar</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/" ? "bg-foreground text-background" : "hover:bg-secondary"
            }`}
          >
            Главная
          </Link>
          <Link
            to="/watchlist"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              pathname === "/watchlist" ? "bg-foreground text-background" : "hover:bg-secondary"
            }`}
          >
            Вотчлист
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
