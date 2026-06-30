import { ExternalLink, Facebook, Instagram, MapPin, Phone, Youtube, MessageCircle } from "lucide-react";

import { SEOHead } from "@/components/SEOHead";
import { Badge, Button } from "@/components/public";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  hand: "icons/mao-crescer.png",
  animatedSvg: "svg-animado/crescer-logoforma-animada-carregando.svg",
  logo: "logos/logotipo horizontal fundo branco.png",
  childrenPNG: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/ambiente-unidades/criancas-png.png",
};

const WHATSAPP_URL = "https://wa.me/5511910163007?text=Ol%C3%A1%2C%20estava%20no%20site%20e%20gostaria%20de%20saber%20mais.";

const units = [
  {
    name: "Clínica Crescer Crianças",
    address: ["Av. Sebastião Silveiro, 115", "Jardim do Sul", "Bragança Paulista - SP", "CEP: 12908-752"],
    phone: "(11) 91016-3007",
    tel: "tel:+5511910163007",
  },
  {
    name: "Clínica Crescer Adolescentes",
    address: ["Rua José Domingues, 606", "Centro", "Bragança Paulista - SP", "CEP: 12900-260"],
    phone: "(11) 91016-3007",
    tel: "tel:+5511910163007",
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/crescer_ic/", icon: Instagram },
  { label: "Youtube", href: "https://www.youtube.com/watch?v=Aqt1M2oj5ec", icon: Youtube },
];

const ComingSoon = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfafc] text-[#262033]">
      <SEOHead title="Em Breve | Clínica Crescer" description="O novo site da Clínica Crescer será lançado em poucos dias." />

      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url("${siteImageUrl(assets.textureYellow)}")`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-x",
        }}
      />

      <img
        src={siteImageUrl(assets.hand)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 hidden w-[680px] max-w-none -translate-y-1/2 opacity-10 motion-safe:animate-[kidsFloat_12000ms_ease-in-out_infinite] md:block"
      />

      <div className="relative z-10 grid min-h-screen items-center gap-10 px-5 py-12 sm:px-6 lg:px-8 lg:grid-cols-2">
        <div className="text-center lg:pl-10 lg:text-left">
          <img
            src={siteImageUrl(assets.animatedSvg)}
            alt=""
            aria-hidden="true"
            className="mx-auto mb-8 h-16 w-16 object-contain motion-safe:animate-[spin_20s_linear_infinite] lg:mx-0"
          />
          <img
            src={siteImageUrl(assets.logo)}
            alt="Clínica Crescer"
            className="mx-auto mb-6 h-11 w-auto max-w-[210px] object-contain lg:mx-0"
            loading="eager"
          />
          <Badge tone="warm" className="mb-6">Em Breve</Badge>
          <h1 className="mb-4 text-4xl font-semibold leading-tight text-[#262033] md:text-5xl">
            Estamos preparando uma nova experiência.
          </h1>
          <p className="mx-auto mb-4 max-w-md text-lg text-[#5d546b] lg:mx-0">
            O novo site da Clínica Crescer será lançado em poucos dias.
          </p>
          <p className="mx-auto mb-6 max-w-md text-base leading-8 text-[#5d546b] lg:mx-0">
            Enquanto finalizamos os últimos detalhes, nossa equipe continua pronta para acolher crianças, adolescentes e suas famílias.
          </p>

          <div className="mx-auto mb-8 max-w-md rounded-2xl bg-white/60 p-4 backdrop-blur-sm lg:mx-0">
            <p className="mb-1 font-semibold text-[#5b3d86]">Intervenção Comportamental para dentro e fora da clínica.</p>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">
              Ciência • Desenvolvimento • Acolhimento
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
            <Button asChild size="lg">
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Falar pelo WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 lg:justify-start">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#5b3d86] transition hover:text-[#8d63c7]"
                >
                  <Icon className="h-4 w-4" />
                  {social.label}
                </a>
              );
            })}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#8b8198]">
              <Facebook className="h-4 w-4" />
              Facebook
              <span className="text-xs uppercase tracking-[0.14em]">Em breve</span>
            </span>
          </div>
        </div>

        <div className="relative hidden h-full min-h-[400px] lg:block">
          <img
            src={assets.childrenPNG}
            alt="Crianças da Clínica Crescer"
            className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[640px] object-contain motion-safe:animate-[kidsFloat_12000ms_ease-in-out_infinite]"
          />
        </div>
      </div>

      <footer className="relative z-10 mt-auto border-t border-white/40 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-5 py-8 sm:px-6 lg:px-8 md:grid-cols-2">
          {units.map((unit) => (
            <div key={unit.name} className="flex items-start gap-3 text-sm text-[#5d546b]">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#8d63c7]" />
              <div>
                <h3 className="mb-1 font-semibold text-[#262033]">{unit.name}</h3>
                {unit.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <a href={unit.tel} className="mt-2 inline-flex items-center gap-2 font-semibold text-[#5b3d86]">
                  <Phone className="h-4 w-4" />
                  {unit.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;