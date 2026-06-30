import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";
import { RouteGuard } from "@/components/RouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/public/ComingSoon";

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
import Produtos from "./pages/public/Produtos";
import ProdutosGamelabs from "./pages/public/ProdutosGamelabs";
import ProdutosEquipe from "./pages/public/ProdutosEquipe";

// Páginas Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogNew from "./pages/admin/AdminBlogNew";
import AdminEquipe from "./pages/admin/AdminEquipe";
import AdminEquipeNew from "./pages/admin/AdminEquipeNew";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminPromotionalBanner from "./pages/admin/AdminPromotionalBanner";
import AdminProdutos from "./pages/admin/AdminProdutos";
import AdminProdutoNovo from "./pages/admin/AdminProdutoNovo";
import AdminProdutoEditar from "./pages/admin/AdminProdutoEditar";

export const SITE_LAUNCHED = false;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rota secreta de preview da Home */}
              <Route path="/preview-home" element={<PublicLayout />}>
                <Route index element={<Index />} />
              </Route>

              {/* Rotas Admin - Sempre ativas */}
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
                <Route path="faixa-promocional" element={<AdminPromotionalBanner />} />
                <Route path="produtos" element={<AdminProdutos />} />
                <Route path="produtos/novo" element={<AdminProdutoNovo />} />
                <Route path="produtos/:id/edit" element={<AdminProdutoEditar />} />
              </Route>

              {/* Pré-lançamento (Coming Soon) */}
              {!SITE_LAUNCHED && (
                <Route path="/*" element={<ComingSoon />} />
              )}

              {/* Rotas Públicas - Apenas quando o site estiver lançado */}
              {SITE_LAUNCHED && (
                <>
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
                    <Route path="produtos" element={<Produtos />} />
                    <Route path="produtos/gamelabs" element={<ProdutosGamelabs />} />
                    <Route path="produtos/equipe" element={<ProdutosEquipe />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;