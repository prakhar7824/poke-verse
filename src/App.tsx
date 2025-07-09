import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BattleProvider } from "@/contexts/BattleContext";
import { TeamProvider } from "@/contexts/TeamContext";
import { ThemeProvider } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import { PokemonDetail } from "./pages/PokemonDetail";
import { BattleArena } from "./pages/BattleArena";
import { Teams } from "./pages/Teams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <TeamProvider>
          <BattleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/battle" element={<BattleArena />} />
                <Route path="/teams" element={<Teams />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BattleProvider>
        </TeamProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
