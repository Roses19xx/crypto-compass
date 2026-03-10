import Navbar from "@/components/Navbar";

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Вотчлист
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Твои избранные проекты будут отображаться здесь.
          </p>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-dashed py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">Пока пусто</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Добавляй проекты в избранное, чтобы они появились здесь
          </p>
        </div>

        {/* Bottom placeholder */}
        <div className="mt-20 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">Секция в разработке</p>
        </div>
      </main>
    </div>
  );
};

export default Watchlist;
