import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";
import { RouteGuard } from "@/components/RouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Páginas Públicas
import Sobre from "./pages/public/Sobre";
import Equipe from "./pages/public/Equipe";
import PrecisaDeAjuda from "./pages/public/PrecisaDeAjuda";
import SinaisAlerta from "./pages/public/SinaisAlerta";
import QuandoProcurarAvaliacao from "./pages/public/QuandoProcurarAvaliacao";
import AvaliacaoNeuropsicologica from "./pages/public/AvaliacaoNeuropsicologica";
import TerapiaABA from "./pages/public/TerapiaABA";
import Adolescentes from "./pages/public/Adolescentes";
import OrientacaoParental from "./pages/public/OrientacaoParental";
import Blog from "./pages/public/Blog";
import BlogPost from "./pages/public/BlogPost";

// Páginas Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogNew from "./pages/admin/AdminBlogNew";
import AdminEquipe from "./pages/admin/AdminEquipe";
import AdminEquipeNew from "./pages/admin/AdminEquipeNew";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Index />} />
              <Route path="sobre" element={<Sobre />} />
              <Route path="equipe" element={<Equipe />} />
              <Route path="como-saber-se-meu-filho-precisa-de-ajuda" element={<PrecisaDeAjuda />} />
              <Route path="sinais-de-alerta-no-desenvolvimento-infantil" element={<SinaisAlerta />} />
              <Route path="quando-procurar-avaliacao" element={<QuandoProcurarAvaliacao />} />
              <Route path="avaliacao-neuropsicologica" element={<AvaliacaoNeuropsicologica />} />
              <Route path="terapia-aba" element={<TerapiaABA />} />
              <Route path="adolescentes" element={<Adolescentes />} />
              <Route path="orientacao-parental" element={<OrientacaoParental />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
            </Route>

            {/* Rotas Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <RouteGuard requireAuth={true}>
                  <AdminLayout />
                </RouteGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/novo" element={<AdminBlogNew />} />
              <Route path="blog/:id/edit" element={<AdminBlogNew />} />
              <Route path="equipe" element={<AdminEquipe />} />
              <Route path="equipe/novo" element={<AdminEquipeNew />} />
              <Route path="equipe/:id/edit" element={<AdminEquipeNew />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;