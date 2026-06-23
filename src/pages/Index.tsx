import Navbar from "@/components/Navbar";
import { LayoutGrid, ArrowRightLeft, Landmark, ArrowUpRight, ListTodo, Briefcase } from "lucide-react";
import { AdminLogin } from '../components/AdminLogin';

const Index = () => {
  const cards = [
    {
      title: "Watchlist",
      subtitle: "Track your personal portfolio and tasks",
      badge: "Core",
      badgeStyle: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: <ListTodo className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
      link: "/watchlist",
      isActive: true,
      // Темная абстрактная сетка/данные
      imgUrl: "https://images.unsplash.com/photo-1614064641913-a520faff3ebb?auto=format&fit=crop&q=80&w=1000",
      gradient: "from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent",
    },
    {
      title: "Web3 Projects",
      subtitle: "Explore, track and manage your ecosystem",
      badge: "Updated",
      badgeStyle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      icon: <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
      link: "/web3-projects",
      isActive: true,
      // Темные блокчейн-ноды
      imgUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000",
      gradient: "from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent",
    },
    {
      title: "Jobs",
      subtitle: "Discover Web3 careers and remote opportunities",
      badge: "New",
      badgeStyle: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
      icon: <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
      link: "/jobs",
      isActive: true,
      // Абстрактная темная геометрия
      imgUrl: "https://images.unsplash.com/photo-1633265486064-086b219458ce?auto=format&fit=crop&q=80&w=1000",
      gradient: "from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent",
    },
    {
      title: "CEX",
      subtitle: "Centralized exchanges and platforms",
      badge: "Coming Soon",
      badgeStyle: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      icon: <Landmark className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
      link: "#",
      isActive: false,
      // Темные 3D кубы
      imgUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1000",
      gradient: "from-[#0a0a0c] via-[#0a0a0c]/50 to-transparent",
    },
    {
      title: "Exchange",
      subtitle: "Decentralized trading and swaps",
      badge: "Coming Soon",
      badgeStyle: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      icon: <ArrowRightLeft className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
      link: "#",
      isActive: false,
      // Абстрактные темные волны
      imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      gradient: "from-[#0a0a0c] via-[#0a0a0c]/50 to-transparent",
    },
  ];

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #232328 0%, #0a0a0c 60%, #000000 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />

      <main className="flex-grow mx-auto w-full max-w-7xl px-6 py-12 sm:py-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.isActive ? card.link : undefined}
              className={`group relative block w-full h-[280px] sm:h-[360px] rounded-[32px] overflow-hidden border transition-all duration-500 transform-gpu ${card.isActive
                ? "cursor-pointer border-white/10 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-1"
                : "cursor-default border-white/10 opacity-95"
                }`}
            >
              <div className="absolute inset-0 z-0 bg-[#161618]">
                <img
                  src={card.imgUrl}
                  alt={card.title}
                  className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform-gpu backface-hidden ${card.isActive ? "group-hover:scale-105 opacity-50 group-hover:opacity-80" : "opacity-40"
                    }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`}></div>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10 pointer-events-none">

                <div className="flex items-start justify-between">
                  <div className="p-3 sm:p-4 bg-black/40 backdrop-blur-xl rounded-[20px] border border-white/10 shadow-lg">
                    {card.icon}
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>

                <div className={`transform transition-transform duration-500 ${card.isActive ? "group-hover:translate-x-2" : ""}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight ${card.isActive ? "text-white" : "text-white/80"}`}>
                      {card.title}
                    </h2>
                    {card.isActive && (
                      <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
                    )}
                  </div>
                  <p className="text-white/70 font-medium text-sm sm:text-base max-w-sm">
                    {card.subtitle}
                  </p>
                </div>

              </div>
            </a>
          ))}
        </div>
      </main>
      <AdminLogin />
    </div>
  );
};

export default Index;