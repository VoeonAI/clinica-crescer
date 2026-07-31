import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ExternalLink, Facebook, Instagram, MapPin, Music2, Phone, Youtube } from "lucide-react";
import { SEOHead } from "./SEOHead";
import { MedicalClinicSchema } from "./Schemas";
import { siteImageUrl } from "@/styles/theme";

const certifications = [
  {
    src: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/selos/ibesselo.jpeg",
    alt: "Certificação IBES",
  },
  {
    src: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/selos/QABA.png",
    alt: "Certificação QABA",
  },
];

const PublicLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/sobre", label: "Sobre" },
    { path: "/equipe", label: "Equipe" },
    { path: "/como-saber-se-meu-filho-precisa-de-ajuda", label: "Precisa de ajuda?" },
    { path: "/avaliacao-neuropsicologica", label: "Avaliação" },
    { path: "/terapia-aba", label: "Terapia ABA" },
    { path: "/produtos", label: "Produtos" },
    { path: "/blog", label: "Blog" },
  ];

  const currentPath = location.pathname;
  const logoHorizontal = siteImageUrl("logos/logotipo horizontal fundo branco.png");
  const logoFooter = siteImageUrl("logos/logotipo vertical fundo branco.png");
  const footerPattern = siteImageUrl("patterns/pattern-branco.png");
  const phone = "(11) 91016-3007";
  const telHref = "tel:+5511910163007";
  const units = [
    {
      name: "Clínica Crescer Crianças",
      address: ["Av. Sebastião Silveiro, 115", "Jardim do Sul", "Bragança Paulista - SP", "CEP: 12908-752"],
    },
    {
      name: "Clínica Crescer Adolescentes",
      address: ["Rua José Domingues, 606", "Centro", "Bragança Paulista - SP", "CEP: 12900-260"],
    },
  ];
  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/crescer_ic/", icon: Instagram },
    { label: "YouTube", href: "https://www.youtube.com/watch?v=Aqt1M2oj5ec", icon: Youtube },
  ];

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
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url("${footerPattern}")`, backgroundSize: "420px auto" }}
        />
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#ffd96f]/30 blur-3xl" />
        <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-[#efe2ff]/70 blur-3xl" />
        <div className="relative mx-auto w-full max-w-[1180px] px-5 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr_0.8fr]">
            <div>
              <img src={logoFooter} alt="Clínica Crescer" className="h-24 w-auto object-contain" loading="lazy" />
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#5d546b]">
                Clínica especializada em desenvolvimento infantil, avaliação neuropsicológica, Terapia ABA e orientação familiar.
              </p>
              <nav aria-label="Links institucionais" className="mt-7">
                <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#5d546b]">
                  <li><Link className="transition hover:text-[#5b3d86]" to="/sobre">Sobre</Link></li>
                  <li><Link className="transition hover:text-[#5b3d86]" to="/equipe">Equipe</Link></li>
                  <li><Link className="transition hover:text-[#5b3d86]" to="/blog">Blog</Link></li>
                  <li><Link className="transition hover:text-[#5b3d86]" to="/terapia-aba">Terapia ABA</Link></li>
                </ul>
              </nav>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8d63c7]">Unidades</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {units.map((unit) => (
                  <address
                    key={unit.name}
                    className="rounded-[24px] border border-[#eee7f6] bg-white/82 p-5 not-italic shadow-[0_14px_45px_rgba(62,46,89,0.07)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(62,46,89,0.11)]"
                  >
                    <div className="flex gap-3">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#8d63c7]" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#262033]">{unit.name}</h3>
                        <div className="mt-3 text-sm leading-6 text-[#5d546b]">
                          {unit.address.map((line) => (
                            <span key={line} className="block">{line}</span>
                          ))}
                        </div>
                        <a href={telHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86] transition hover:text-[#8d63c7]">
                          <Phone className="h-4 w-4" />
                          {phone}
                        </a>
                      </div>
                    </div>
                  </address>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8d63c7]">Redes sociais</h2>
              <div className="mt-4 space-y-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#eee7f6] bg-white/82 px-4 py-3 text-sm font-medium text-[#5d546b] shadow-[0_10px_34px_rgba(62,46,89,0.05)] transition hover:-translate-y-0.5 hover:text-[#5b3d86] hover:shadow-[0_16px_48px_rgba(62,46,89,0.1)]"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon className="h-4 w-4 text-[#8d63c7]" />
                        {social.label}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#b0a7bd]" />
                    </a>
                  );
                })}
                <div className="flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white/62 px-4 py-3 text-sm font-medium text-[#8b8198]">
                  <Facebook className="h-4 w-4 text-[#8d63c7]/70" />
                  Facebook
                  <span className="ml-auto text-xs font-semibold uppercase tracking-[0.14em] text-[#b0a7bd]">Em breve</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white/62 px-4 py-3 text-sm font-medium text-[#8b8198]">
                  <Music2 className="h-4 w-4 text-[#8d63c7]/70" />
                  TikTok
                  <span className="ml-auto text-xs font-semibold uppercase tracking-[0.14em] text-[#b0a7bd]">Em breve</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificações e Reconhecimentos */}
          <div className="mt-10 rounded-[28px] border border-[#eee7f6] bg-[#fbfafc] p-7 sm:p-8">
            <h2 className="text-center text-sm font-semibold uppercase tracking-[0.16em] text-[#8d63c7]">
              Certificações e Reconhecimentos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-[#5d546b]">
              A Clínica Crescer atua alinhada às melhores práticas em intervenção comportamental, mantendo compromisso com formação contínua, qualidade técnica e atendimento baseado em evidências.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
              {certifications.map((cert) => (
                <img
                  key={cert.alt}
                  src={cert.src}
                  alt={cert.alt}
                  className="h-20 w-auto max-w-[180px] object-contain transition-transform duration-300 hover:scale-[1.03] sm:h-24"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#eee7f6] pt-6 text-xs text-[#8b8198] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Clínica Crescer. Todos os direitos reservados.</p>
            <a
              href="https://voeagencia.com.br"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium transition hover:text-[#5b3d86]"
            >
              Desenvolvido por Voe Agência
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;