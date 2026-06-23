import { Link, useLocation } from "react-router-dom";
import { Cloud, LogOut, Compass, LayoutGrid, ListTodo, Briefcase, Landmark, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Обновленный массив ссылок со всеми вкладками и правильными иконками
  const navLinks = [
    { name: "Explore", path: "/explore", icon: Compass },
    { name: "Web3 Projects", path: "/web3-projects", icon: LayoutGrid },
    { name: "Watchlist", path: "/watchlist", icon: ListTodo },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "CEX", path: "/cex", icon: Landmark },
    { name: "Exchange", path: "/exchange", icon: ArrowRightLeft },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-[#0a0a0c]/80 backdrop-blur-2xl border-b border-white/[0.05] z-50 px-4 sm:px-6 lg:px-10 flex items-center justify-between transition-all">

        {/* ЛОГОТИП */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Cloud className="w-6 h-6 text-white opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" />
          <span className="text-white font-semibold text-lg tracking-tight hidden sm:block">Web3 CRM</span>
        </Link>

        {/* ЦЕНТРАЛЬНАЯ НАВИГАЦИЯ */}
        {/* Используем lg:flex и немного уменьшаем gap, чтобы 6 кнопок влезли на 13-дюймовые экраны */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative group flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${isActive
                    ? "bg-white/[0.08] text-white border border-white/[0.05] shadow-sm"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  }`}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "text-white" : "text-white/50 group-hover:text-white group-hover:scale-110"}`} />
                  <span className="whitespace-nowrap">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ПРАВАЯ ЧАСТЬ (АВТОРИЗАЦИЯ) */}
        <div className="flex items-center">
          {user ? (
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]" />
              <span className="hidden sm:block">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="relative group overflow-hidden bg-white text-black px-5 py-2 rounded-xl text-[13px] font-semibold hover:bg-gray-100 transition-all duration-300 active:scale-95 shadow-[0_2px_10px_rgba(255,255,255,0.1)]"
            >
              {/* Эффект блика */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0"></div>
              <span className="relative z-10">Sign In</span>
            </button>
          )}
        </div>
      </nav>

      {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}

      <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
    </>
  );
};

export default Navbar;