import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";

const Home = lazy(() => import("./pages/Home"));
const Cards = lazy(() => import("./pages/Cards"));
const CardDetail = lazy(() => import("./pages/CardDetail"));
const Teams = lazy(() => import("./pages/Teams"));
const TeamDetail = lazy(() => import("./pages/TeamDetail"));
const Register = lazy(() => import("./pages/Register"));
const TeamEdit = lazy(() => import("./pages/TeamEdit"));
const VehicleEdit = lazy(() => import("./pages/VehicleEdit"));
const Duel = lazy(() => import("./pages/Duel"));
const Collection = lazy(() => import("./pages/Collection"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Guide = lazy(() => import("./pages/Guide"));
const Expeditions = lazy(() => import("./pages/Expeditions"));
const Admin = lazy(() => import("./pages/Admin"));
const Qr = lazy(() => import("./pages/Qr"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cartas" element={<Cards />} />
      <Route path="/carta/:slug" element={<CardDetail />} />
      <Route path="/carta/:vehicleSlug/editar" element={<VehicleEdit />} />
      <Route path="/equipes" element={<Teams />} />
      <Route path="/equipe/:slug" element={<TeamDetail />} />
      <Route path="/equipe/:slug/editar" element={<TeamEdit />} />
      <Route path="/equipe/:teamSlug/novo-veiculo" element={<VehicleEdit />} />
      <Route path="/cadastrar" element={<Register />} />
      <Route path="/duelo" element={<Duel />} />
      <Route path="/colecao" element={<Collection />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/guia" element={<Guide />} />
      <Route path="/expedicoes" element={<Expeditions />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/qr" element={<Qr />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster theme="dark" position="top-center" richColors closeButton />
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
