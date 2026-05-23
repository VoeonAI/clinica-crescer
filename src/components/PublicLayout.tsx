import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SEOHead } from "./SEOHead";
import { MedicalClinicSchema } from "./Schemas";
import { siteImageUrl } from "@/styles/theme";

const PublicLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/sobre", label: "Sobre" },
    { path: "/equipe", label: "Equipe" },
    { path: "/como-saber-se-meu-filho-precisa-de-ajuda", label: "Precisa de ajuda?" },
    { path: "/avaliacao-neuropsicologica", label: "Avaliação" },
    { path: "/terapia-aba", label: "Terapia ABA" },
    { path: "/blog", label: "Blog" },
  ];

  const currentPath = location.pathname;
  const logoHorizontal = siteImageUrl("logos/logotipo horizontal fundo branco.png");
  const logoFooter = siteImageUrl("logos/logotipo vertical fundo branco.png");
  const footerPattern = siteImageUrl("patterns/pattern-branco.png");

  return (
    <div className="min-h-screen bg-[#fbfafc] text-[#262033]">
      <SEOHead />
      <MedicalClinicSchema />

      <header className="sticky top-0 z-50 border-b border-[#eee7f6] bg-white/92 backdrop-blur-md">
        <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between gap-6" aria-label="Navegação principal">
            <Link to="/" className="flex min-w-0 items-center" aria-label="Clínica Crescer - página inicial">
              <img
                src={logoHorizontal}
                alt="Clínica Crescer"
                className="h-11 w-auto max-w-[210px] object-contain"
                loading="eager"
              />
            </Link>

            <ul className="hidden items-center gap-5 lg:flex">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-[#5b3d86] ${
                      currentPath === item.path ? "text-[#5b3d86]" : "text-[#5d546b]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Link
                to="/como-saber-se-meu-filho-precisa-de-ajuda"
                className="hidden rounded-full bg-[#5b3d86] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(91,61,134,0.18)] transition hover:bg-[#4d3175] md:inline-flex"
              >
                Preciso de ajuda
              </Link>
              <Link to="/admin/login" className="text-xs font-medium text-[#8b8198] transition hover:text-[#5b3d86]">
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="relative overflow-hidden border-t border-[#eee7f6] bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `url("${footerPattern}")`, backgroundSize: "420px auto" }}
        />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div>
              <img src={logoFooter} alt="Clínica Crescer" className="h-24 w-auto object-contain" loading="lazy" />
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#5d546b]">
                Clínica especializada em desenvolvimento infantil, avaliação neuropsicológica, Terapia ABA e orientação familiar.
              </p>
            </div>

            <nav aria-label="Links institucionais">
              <h2 className="text-sm font-semibold text-[#262033]">Institucional</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#5d546b]">
                <li><Link className="hover:text-[#5b3d86]" to="/sobre">Sobre a clínica</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/equipe">Equipe</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/blog">Blog</Link></li>
              </ul>
            </nav>

            <nav aria-label="Serviços">
              <h2 className="text-sm font-semibold text-[#262033]">Serviços</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#5d546b]">
                <li><Link className="hover:text-[#5b3d86]" to="/avaliacao-neuropsicologica">Avaliação neuropsicológica</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/terapia-aba">Terapia ABA</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/orientacao-parental">Orientação familiar</Link></li>
              </ul>
            </nav>

            <div>
              <h2 className="text-sm font-semibold text-[#262033]">Contato e localização</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-[#5d546b]">
                <p className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#8d63c7]" /> Atendimento especializado para famílias da região.</p>
                <p className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0 text-[#8d63c7]" /> Telefone configurável.</p>
                <p className="flex gap-2"><MessageCircle className="mt-1 h-4 w-4 shrink-0 text-[#8d63c7]" /> WhatsApp configurável.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#eee7f6] pt-6 text-center text-xs text-[#8b8198]">
            © {new Date().getFullYear()} Clínica Crescer. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
