import Navbar from "@/components/Navbar";
import { LayoutGrid, ArrowRightLeft, Wallet, ShieldQuestion } from "lucide-react";

const Explore = () => {
    // Конфигурация меню в стиле Apple
    const menuItems = [
        {
            title: "Web3 Projects",
            subtitle: "Updated",
            icon: <LayoutGrid className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
            link: "/web3-projects", // Ссылка на вашу старую страницу проектов
            isActive: true,
            subtitleColor: "text-[#0A84FF]", // Фирменный синий
        },
        {
            title: "Bridges",
            subtitle: "New",
            icon: <ArrowRightLeft className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />,
            link: "/bridges",
            isActive: true,
            subtitleColor: "text-[#FF453A]", // Фирменный красно-оранжевый Apple
        },
        {
            title: "Airdrops",
            subtitle: "Coming Soon",
            icon: <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" strokeWidth={1.5} />,
            link: "#",
            isActive: false,
            subtitleColor: "text-[#8E8E93]", // Серый
        },
        {
            title: "DeFi Tools",
            subtitle: "Coming Soon",
            icon: <ShieldQuestion className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" strokeWidth={1.5} />,
            link: "#",
            isActive: false,
            subtitleColor: "text-[#8E8E93]", // Серый
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

            <main className="flex-grow mx-auto w-full max-w-7xl px-6 py-20 flex flex-col items-center justify-center">

                {/* Горизонтальная сетка в стиле навигации Apple */}
                <div className="flex flex-wrap items-end justify-center gap-8 sm:gap-12 md:gap-16 mt-[-10vh]">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.isActive ? item.link : undefined}
                            className={`flex flex-col items-center group transition-all duration-500 ${item.isActive ? 'cursor-pointer hover:-translate-y-2' : 'cursor-default opacity-60'
                                }`}
                        >
                            {/* Apple Squircle (Квадрат со скругленными углами) */}
                            <div
                                className={`relative w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] flex items-center justify-center rounded-[22px] sm:rounded-[28px] mb-4 sm:mb-5 transition-all duration-500 shadow-lg border border-white/5 bg-white/[0.02] backdrop-blur-xl
                ${item.isActive ? 'group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]' : ''}`}
                            >
                                {/* Легкий блик для активных элементов */}
                                {item.isActive && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.08] to-transparent rounded-[22px] sm:rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                )}
                                {item.icon}
                            </div>

                            {/* Заголовок */}
                            <span
                                className="text-sm sm:text-[15px] font-medium text-white mb-1 tracking-tight"
                                style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                            >
                                {item.title}
                            </span>

                            {/* Тег (New / Updated / Coming Soon) */}
                            <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${item.subtitleColor}`}>
                                {item.subtitle}
                            </span>
                        </a>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default Explore;