import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Web3Projects from "./pages/Web3Projects"; // <-- Импорт новой страницы
import Watchlist from "./pages/Watchlist";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/web3-projects" element={<Web3Projects />} /> {/* <-- Путь для проектов */}
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;