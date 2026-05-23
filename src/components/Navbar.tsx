import { Link, useLocation } from "react-router-dom";
import { Cloud, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    // Проверяем, вошел ли юзер при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Слушаем изменения (если вошел или вышел)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/5 z-50 px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Cloud className="w-6 h-6 text-[#00E5FF] group-hover:scale-110 transition-transform duration-300" />
          <span className="text-white font-bold text-lg tracking-wide hidden sm:block">Web3 CRM</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/explore" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/explore' ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            Explore
          </Link>
          <Link to="/web3-projects" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/web3-projects' ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            Web3 Projects
          </Link>
          <Link to="/watchlist" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/watchlist' ? 'text-white' : 'text-white/40 hover:text-white'}`}>
            Watchlist
          </Link>
        </div>

        <div className="flex items-center">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}
    </>
  );
};

export default Navbar;