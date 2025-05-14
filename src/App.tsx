
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Filters from "./pages/Filters";
import Builder from "./pages/Builder";
import Validation from "./pages/Validation";
import NotFound from "./pages/NotFound";
import { FilterProvider } from "./context/FilterContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
