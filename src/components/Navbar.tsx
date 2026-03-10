import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span
            className="flex items-center justify-center rounded-lg text-sm font-extrabold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #659DBD, #4a8aad)',
              color: '#FBEEC1',
              width: 36,
              height: 36,
              textShadow: '0 1px 2px rgba(0,0,0,0.25)',
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
              fontSize: 15,
              letterSpacing: '-0.02em',
            }}
          >
            DB
          </span>
          <span className="text-xl font-extrabold tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            <span
              className="inline-block"
              style={{
                color: '#659DBD',
                textShadow: '0 0 8px rgba(101,157,189,0.35), 0 1px 1px rgba(0,0,0,0.15)',
                filter: 'blur(0.3px)',
                fontStyle: 'italic',
                marginRight: 1,
              }}
            >
              D
            </span>
            <span style={{ color: '#659DBD', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>rop</span>
            <span style={{ color: '#bfa84f', textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>Board</span>
          </span>
        </Link>

        {/* Centered Nav */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          <Link
            to="/"
            className="rounded-full px-5 py-2 text-sm font-semibold transition-colors"
            style={
              pathname === "/"
                ? { background: '#659DBD', color: '#FBEEC1', textShadow: '0 1px 1px rgba(0,0,0,0.15)' }
                : { color: '#659DBD' }
            }
          >
            Главная
          </Link>
          <Link
            to="/watchlist"
            className="rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            style={
              pathname === "/watchlist"
                ? { background: '#659DBD', color: '#FBEEC1', textShadow: '0 1px 1px rgba(0,0,0,0.15)' }
                : { color: '#659DBD' }
            }
          >
            Вотчлист
          </Link>
        </div>

        {/* Spacer for balance */}
        <div className="w-[140px]" />
      </div>
    </nav>
  );
};

export default Navbar;
