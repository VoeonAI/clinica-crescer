import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Puzzle,
  Sparkles,
} from "lucide-react";

import { SEOHead } from "@/components/SEOHead";
import { FAQSchema, MedicalClinicSchema } from "@/components/Schemas";
import { PromotionalBanner } from "@/components/public/PromotionalBanner";
import { InsuranceBenefits } from "@/components/InsuranceBenefits";
import {
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Section,
} from "@/components/public";
import { siteImageUrl } from "@/styles/theme";
import { blogService, BlogPost } from "@/services/blogService";
import { staffService, StaffMember } from "@/services/staffService";
import { cn } from "@/lib/utils";

const ASSETS = {
  hero: "ambiente-unidades/recepcao-clinica-crescer.jpg",
  about: "ambiente-unidades/crianca-vila-crescer.png",
  abaFamily: "ambiente-unidades/Familia-crescer.png",
  facade: "ambiente-unidades/fachada-unidade-criancas-crescer.jpg",
  village: "ambiente-unidades/vila-crescer.jpg",
  texturePurple: "backgrounds/textura-roxa.png",
  textureYellow: "backgrounds/textura-amarela.png",
  patternWhite: "patterns/pattern-branco.png",
  patternPurple: "patterns/pattern-roxo.png",
  icon: "icons/icone.png",
  hand: "icons/mao-crescer.png",
  animatedSvg: "svg-animado/crescer-logoforma-animada-carregando.svg",
};

const HERO_VIDEO_URL =
  "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/video/A-clinica-crescer-cresceu-web-720.mp4";
const WHATSAPP_BASE_URL = "https://wa.me/5511910163007";
const WHATSAPP_DEFAULT_TEXT =
  "Olá, vim pelo site da Clínica Crescer.";

const units = [
  {
    name: "Clínica Crescer Crianças",
    addressLines: ["Av. Sebastião Silveiro, 115", "Jardim do Sul", "Bragança Paulista - SP", "CEP: 12908-752"],
    phone: "(11) 91016-3007",
    tel: "tel:+5511910163007",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Av.%20Sebasti%C3%A3o%20Silveiro%2C%20115%2C%20Jardim%20do%20Sul%2C%20Bragan%C3%A7a%20Paulista%20-%20SP%2C%2012908-752",
  },
  {
    name: "Clínica Crescer Adolescentes",
    addressLines: ["Rua José Domingues, 606", "Centro", "Bragança Paulista - SP", "CEP: 12900-260"],
    phone: "(11) 91016-3007",
    tel: "tel:+5511910163007",
    mapsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Rua%20Jos%C3%A9%20Domingues%2C%20606%2C%20Centro%2C%20Bragan%C3%A7a%20Paulista%20-%20SP%2C%2012900-260",
  },
];

const interestOptions = [
  "Avaliação neuropsicológica",
  "Terapia ABA",
  "Orientação familiar",
  "Desenvolvimento infantil",
  "Ainda não sei",
];

const contactReasonOptions = [
  "Percebi alguns comportamentos em casa",
  "A escola sugeriu procurar ajuda",
  "Um profissional de saúde indicou",
  "Dúvidas sobre desenvolvimento",
  "Dificuldades de comportamento",
  "Outro motivo",
];

const services = [
  {
    title: "Avaliação neuropsicológica",
    description:
      "Investigação do funcionamento cognitivo, emocional, comportamental e escolar para orientar decisões com mais segurança.",
    href: "/avaliacao-neuropsicologica",
    icon: Brain,
    tone: "lilac" as const,
  },
  {
    title: "Terapia ABA",
    description:
      "Intervenção baseada em dados para desenvolver comunicação, autonomia, aprendizagem e habilidades sociais na vida real.",
    href: "/terapia-aba",
    icon: Puzzle,
    tone: "blue" as const,
  },
  {
    title: "Orientação familiar",
    description:
      "Apoio para pais e cuidadores com estratégias práticas, acompanhamento próximo e linguagem acessível.",
    href: "/orientacao-parental",
    icon: HeartHandshake,
    tone: "warm" as const,
  },
  {
    title: "Desenvolvimento infantil",
    description:
      "Olhar integral para linguagem, comportamento, rotina, aprendizagem, interação social e marcos do desenvolvimento.",
    href: "/como-saber-se-meu-filho-precisa-de-ajuda",
    icon: Sparkles,
    tone: "coral" as const,
  },
];

const alertSigns = [
  "Atrasos na fala, linguagem ou comunicação",
  "Pouco contato visual ou dificuldade de interação",
  "Crises frequentes, rigidez ou seletividade intensa",
  "Dificuldades escolares persistentes",
  "Regressão de habilidades já adquiridas",
  "Dúvidas da família sobre desenvolvimento ou comportamento",
];

const directAnswers = [
  {
    question: "O que a Clínica Crescer faz?",
    answer:
      "A Clínica Crescer realiza avaliação neuropsicológica, Terapia ABA, orientação familiar e acompanhamento multidisciplinar para crianças, adolescentes e famílias.",
  },
  {
    question: "Quando procurar uma avaliação?",
    answer:
      "Procure avaliação quando houver atrasos no desenvolvimento, dificuldades de aprendizagem, alterações de comportamento, suspeita de TEA ou TDAH, ou quando a família precisar entender melhor o que está acontecendo.",
  },
  {
    question: "Como funciona a Terapia ABA?",
    answer:
      "A Terapia ABA usa princípios da análise do comportamento, metas individualizadas e acompanhamento por dados para desenvolver habilidades funcionais em casa, na escola e na clínica.",
  },
  {
    question: "Como a família participa do processo?",
    answer:
      "A família participa com escuta, orientação, treino de estratégias e acompanhamento contínuo, para que a intervenção não fique restrita à sessão.",
  },
];

const faqData = [
  ...directAnswers,
  {
    question: "A Clínica Crescer atende crianças e adolescentes?",
    answer:
      "Sim. A clínica atende crianças, adolescentes e famílias, com abordagem individualizada para cada fase do desenvolvimento.",
  },
  {
    question: "Terapia ABA é indicada apenas para autismo?",
    answer:
      "Não. A ABA é muito usada em casos de TEA, mas seus princípios também podem apoiar comunicação, autonomia, aprendizagem e comportamento em diferentes perfis, sempre com plano individualizado.",
  },
];

const HomeImage = ({
  src,
  alt,
  className,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = src ? siteImageUrl(src) : "";

  if (!resolvedSrc || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex min-h-[320px] items-center justify-center bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]",
          className,
        )}
      >
        <img src={siteImageUrl(ASSETS.icon)} alt="" className="h-20 w-20 object-contain opacity-80" loading="lazy" />
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
};

const FloatingMark = ({ className }: { className?: string }) => (
  <img
    src={siteImageUrl(ASSETS.animatedSvg)}
    alt=""
    aria-hidden="true"
    className={cn("pointer-events-none absolute z-10 h-24 w-24 object-contain opacity-90", className)}
    loading="lazy"
  />
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
    <path d="M16.02 3.2A12.67 12.67 0 0 0 5.3 22.62L3.6 28.8l6.33-1.66A12.65 12.65 0 1 0 16.02 3.2Zm0 22.98a10.43 10.43 0 0 1-5.32-1.46l-.38-.22-3.75.98 1-3.65-.25-.39a10.43 10.43 0 1 1 8.7 4.74Zm5.72-7.82c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.52-1.55-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.4 5.4 4.77.75.32 1.34.52 1.8.66.76.24 1.45.21 1.99.13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
  </svg>
);

const Index = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [heroVideoActive, setHeroVideoActive] = useState(false);
  const [abaHandOffset, setAbaHandOffset] = useState(0);
  const [contactForm, setContactForm] = useState({
    guardianName: "",
    childName: "",
    city: "",
    phone: "",
    interest: "",
    reason: "",
    message: "",
  });
  const [contactError, setContactError] = useState("");
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const abaSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHomeContent = async () => {
      try {
        const [postsData, staffData] = await Promise.all([
          blogService.getPublishedPosts(),
          staffService.getActiveStaff(),
        ]);

        if (!mounted) return;
        setLatestPosts(postsData.slice(0, 3));
        setStaff(staffData);
      } catch (error) {
        console.error("Error loading home content:", error);
      } finally {
        if (mounted) setLoadingContent(false);
      }
    };

    loadHomeContent();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const section = abaSectionRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    if (!section || reducedMotion || mobile) return;

    let frame = 0;

    const updateHandOffset = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      setAbaHandOffset(Math.max(-14, Math.min(14, progress * -18)));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHandOffset);
    };

    updateHandOffset();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const founder = useMemo(() => {
    return (
      staff.find((member) => member.is_featured) ||
      staff.find((member) => member.member_type === "founder") ||
      staff[0]
    );
  }, [staff]);

  const visibleTeam = useMemo(() => {
    return staff.filter((member) => member.id !== founder?.id).slice(0, 6);
  }, [founder?.id, staff]);

  const handleHeroPlay = () => {
    const video = heroVideoRef.current;

    if (!video) return;

    setHeroVideoActive(true);
    video.currentTime = 0;
    video.muted = false;
    video.volume = 0.72;
    void video.play();
  };

  const handleHeroStop = () => {
    const video = heroVideoRef.current;

    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
    setHeroVideoActive(false);
  };

  const defaultWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(WHATSAPP_DEFAULT_TEXT)}`;

  const handleContactFieldChange = (field: keyof typeof contactForm, value: string) => {
    setContactForm((current) => ({ ...current, [field]: value }));
    if (contactError) setContactError("");
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields = [
      contactForm.guardianName,
      contactForm.childName,
      contactForm.city,
      contactForm.phone,
      contactForm.interest,
      contactForm.reason,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      setContactError("Preencha os campos obrigatórios para enviar pelo WhatsApp.");
      return;
    }

    const details = contactForm.message.trim();
    const message = [
      "Olá!",
      "",
      `Meu nome é *${contactForm.guardianName}* e estou entrando em contato pelo site da *Clínica Crescer*.`,
      "",
      "*Nome da criança/adolescente:*",
      contactForm.childName,
      "",
      "*Cidade:*",
      contactForm.city,
      "",
      "*Telefone para contato:*",
      contactForm.phone,
      "",
      "*Serviço de interesse:*",
      contactForm.interest,
      "",
      "*O que motivou o contato:*",
      contactForm.reason,
      "",
      ...(details ? ["*Mais detalhes:*", details, ""] : []),
      "Obrigado(a)! Aguardo retorno.",
    ].join("\n");

    window.open(`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Clínica Crescer",
    description:
      "Clínica especializada em desenvolvimento infantil, avaliação neuropsicológica, Terapia ABA e orientação familiar.",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title="Intervenção que faz sentido fora da clínica"
        description="Na Clínica Crescer, a terapia não termina na sessão. Transformamos intervenção especializada em evolução funcional na vida real, com participação ativa da família e decisões baseadas em dados."
        keywords="Clínica Crescer, desenvolvimento infantil, avaliação neuropsicológica, Terapia ABA, orientação familiar, sinais de alerta infantil, intervenção precoce, neuropsicologia infantil"
        ogImage={siteImageUrl(ASSETS.facade)}
        ogType="website"
        schema={homeSchema}
      />
      <MedicalClinicSchema />
      <FAQSchema faqs={faqData} />

      <main className="bg-[#fbfafc] text-[#262033]">
        <Section className="min-h-[calc(100vh-5rem)] bg-[#fbfafc] pb-16 pt-14 md:pb-24 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[88%] opacity-[0.42] mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(circle at 82% 18%, rgba(255,217,111,0.34), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,230,135,0.22) 45%, rgba(251,250,252,0.44)), url("${siteImageUrl(ASSETS.textureYellow)}")`,
              backgroundPosition: "center, center, center top",
              backgroundRepeat: "no-repeat, no-repeat, repeat-x",
              backgroundSize: "cover, cover, 760px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[88%] bg-gradient-to-r from-[#fbfafc]/42 via-transparent to-[#fbfafc]/18"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#fbfafc]/82 to-[#fbfafc]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#ffd96f]/45 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute left-[46%] top-16 hidden h-72 w-72 rounded-full bg-[#dff1ff]/60 blur-3xl lg:block"
          />
          <Container className="grid items-center gap-12 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="relative z-10">
              <Badge tone="warm" className="mb-6">
                Desenvolvimento com orientação para a vida real
              </Badge>
              <Heading
                level={1}
                title="Intervenção que faz sentido fora da clínica"
                description="Na Clínica Crescer, a terapia não termina na sessão. Nós transformamos intervenção especializada em evolução funcional na vida real, com participação ativa da família e decisões baseadas em dados."
                descriptionClassName="text-lg sm:text-xl"
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" withArrow>
                  <Link to="/como-saber-se-meu-filho-precisa-de-ajuda">Preciso de ajuda</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/sobre">Conhecer a Clínica Crescer</Link>
                </Button>
              </div>
              <div className="relative -mx-3 mt-9 grid gap-3 rounded-[28px] bg-[#fbfafc]/20 px-3 py-2 text-sm text-[#4b435a] backdrop-blur-[2px] sm:grid-cols-3">
                {["Equipe multidisciplinar", "Decisões baseadas em dados", "Família como parceira"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8d63c7]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto min-h-[560px] w-full max-w-[560px] lg:mx-0">
              <FloatingMark className="-right-2 -top-8 h-28 w-28" />
              <div
                aria-hidden="true"
                className="absolute left-2 top-20 h-[390px] w-[72%] rounded-[48px] bg-[#efe2ff]/90 shadow-[0_24px_80px_rgba(62,46,89,0.08)]"
                style={{ transform: "rotate(-8deg)" }}
              />
              <div
                aria-hidden="true"
                className={cn(
                  "absolute bottom-6 right-8 h-72 w-72 rounded-full bg-[#8d63c7]/18 blur-3xl transition-all duration-700",
                  heroVideoActive && "scale-110 bg-[#8d63c7]/28",
                )}
              />
              <div
                aria-hidden="true"
                className="absolute right-0 top-16 h-[440px] w-[78%] rounded-[56px] opacity-70 shadow-[0_22px_70px_rgba(62,46,89,0.12)]"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.82), rgba(239,226,255,0.64)), url("${siteImageUrl(ASSETS.patternPurple)}")`,
                  backgroundSize: "cover, 360px auto",
                  transform: "rotate(7deg)",
                }}
              />

              <div
                className={cn(
                  "group absolute left-1/2 top-2 z-20 w-[270px] -translate-x-1/2 animate-[heroFloat_12500ms_ease-in-out_infinite] transition-[filter,--hero-phone-y,--hero-phone-scale] duration-1000 ease-out sm:w-[310px] lg:left-[55%]",
                  heroVideoActive && "z-40 drop-shadow-[0_42px_72px_rgba(91,61,134,0.28)]",
                )}
                style={
                  {
                    "--hero-phone-rotate": "-5deg",
                    "--hero-phone-scale": heroVideoActive ? "1.018" : "1",
                    "--hero-phone-y": heroVideoActive ? "-6px" : "0px",
                  } as CSSProperties
                }
              >
                <div
                  className={cn(
                    "relative rounded-[46px] bg-[#262033] p-3 shadow-[0_42px_110px_rgba(38,32,51,0.34)] ring-1 ring-white/40 transition-[box-shadow,transform,ring-color] duration-1000 ease-out group-hover:-translate-y-1",
                    heroVideoActive && "shadow-[0_54px_130px_rgba(38,32,51,0.46)] ring-2 ring-[#fff3c7]/80",
                  )}
                >
                  <div className="absolute left-1/2 top-3 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#16121d]" />
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[34px] bg-[#efe2ff]">
                    <video
                      ref={heroVideoRef}
                      className="h-full w-full object-cover"
                      src={HERO_VIDEO_URL}
                      autoPlay
                      muted={!heroVideoActive}
                      loop
                      playsInline
                      preload="metadata"
                      aria-label="Vídeo institucional da Clínica Crescer"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#262033]/22 via-transparent to-white/8" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#262033]/42 to-transparent" />
                    {!heroVideoActive && (
                    <button
                      type="button"
                      onClick={handleHeroPlay}
                      className={cn(
                        "absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 shadow-[0_18px_55px_rgba(91,61,134,0.28)] outline-none ring-1 ring-white/80 backdrop-blur-md transition-all duration-700 ease-out hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#ffd96f]",
                      )}
                      aria-label="Assistir vídeo com áudio"
                    >
                      <div className="ml-1 h-0 w-0 border-y-[12px] border-l-[18px] border-y-transparent border-l-[#5b3d86]" />
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {heroVideoActive && (
                <button
                  type="button"
                  onClick={handleHeroStop}
                  className="absolute right-3 top-[470px] z-50 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/86 px-4 py-2 text-xs font-semibold text-[#342d3f] shadow-[0_18px_48px_rgba(62,46,89,0.18)] backdrop-blur-xl transition-all duration-700 ease-out hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63c7] sm:right-12 lg:right-6"
                  aria-label="Parar vídeo"
                >
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-[#8d63c7]" aria-hidden="true" />
                  Parar
                </button>
              )}

              <div
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-52 w-72 rounded-[38px] opacity-80 shadow-[0_22px_70px_rgba(62,46,89,0.12)]"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,243,199,0.82)), url("${siteImageUrl(ASSETS.patternPurple)}")`,
                  backgroundSize: "cover, 320px auto",
                }}
              />
              <div className="absolute bottom-10 left-2 right-2 z-30 rounded-[30px] border border-white/85 bg-white/85 p-5 shadow-[0_24px_72px_rgba(62,46,89,0.18)] backdrop-blur-xl sm:-left-2 sm:right-auto sm:max-w-[370px] sm:p-6 lg:-left-6">
                <div className="flex items-start gap-4">
                  <img
                    src={siteImageUrl(ASSETS.animatedSvg)}
                    alt=""
                    aria-hidden="true"
                    className="mt-1 h-10 w-10 shrink-0 object-contain"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#262033]">Cuidado que continua na vida real</p>
                    <p className="mt-2 text-sm leading-6 text-[#342d3f]">
                    Um espaço preparado para acolher dúvidas, orientar famílias e acompanhar cada criança com respeito ao seu tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <PromotionalBanner />

        <Section tone="default" className="overflow-visible">
          <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-8 -top-8 hidden h-40 w-40 rounded-full bg-[#dff1ff] lg:block" />
              <div className="absolute -right-4 bottom-16 hidden h-36 w-36 rounded-full bg-[#fff3c7]/45 blur-xl lg:block" />
              <div
                aria-hidden="true"
                className="absolute inset-6 rounded-[46px] opacity-20"
                style={{
                  backgroundImage: `url("${siteImageUrl(ASSETS.about)}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  transform: "translateY(18px) scale(1.03) rotate(-2deg)",
                }}
              />
              <div
                className="group relative h-[460px] overflow-hidden rounded-[46px] shadow-[0_22px_58px_rgba(62,46,89,0.14)]"
                style={{ clipPath: "polygon(0 0, 100% 8%, 94% 100%, 8% 94%)" }}
              >
                <div className="absolute inset-0 scale-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.07]">
                  <HomeImage src={ASSETS.about} alt="Criança em ambiente acolhedor da Vila Crescer" className="h-full w-full" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#262033]/24 via-transparent to-[#fff3c7]/18" />
                <div className="pointer-events-none absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-[#8d63c7]/10 blur-xl transition-transform duration-700 ease-out group-hover:-translate-y-1" />
              </div>
              <Card className="absolute -bottom-8 right-4 max-w-sm border-white/80 bg-white/88 shadow-[0_22px_70px_rgba(62,46,89,0.16)] backdrop-blur-xl">
                <p className="text-sm leading-7 text-[#342d3f]">
                  A clínica foi pensada para unir técnica, conforto e acolhimento em uma experiência menos fria e mais humana.
                </p>
              </Card>
            </div>

            <div className="relative order-1 lg:order-2">
              <Heading
                eyebrow="Conheça a Clínica Crescer"
                title="Conheça a Clínica Crescer"
                description="Somos uma clínica especializada em desenvolvimento da criança e do adolescente, avaliação neuropsicológica, Terapia ABA e orientação familiar. Nosso trabalho combina ciência, acolhimento e uma visão funcional do desenvolvimento."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    text: "Avaliação para orientar decisões clínicas e escolares com mais segurança.",
                    className: "border-[#8d63c7]/20 bg-[#7d55b8] text-white shadow-[0_18px_55px_rgba(91,61,134,0.22)]",
                    icon: "text-[#fff3c7]",
                  },
                  {
                    text: "Intervenções conectadas à rotina da criança, da família e da escola.",
                    className: "border-[#ffd96f]/50 bg-[#fff1b8] text-[#342d3f] shadow-[0_18px_55px_rgba(202,160,44,0.16)]",
                    icon: "text-[#8d63c7]",
                  },
                  {
                    text: "Equipe integrada para enxergar o desenvolvimento por vários ângulos.",
                    className: "border-[#b8e0f4]/60 bg-[#dff1ff] text-[#263647] shadow-[0_18px_55px_rgba(80,139,170,0.16)]",
                    icon: "text-[#5b3d86]",
                  },
                  {
                    text: "Acompanhamento que valoriza vínculo, autonomia e qualidade de vida.",
                    className: "border-[#f3a38f]/45 bg-[#e98773] text-white shadow-[0_18px_55px_rgba(205,103,82,0.2)]",
                    icon: "text-[#fff3c7]",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl border p-5 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,46,89,0.18)]",
                      item.className,
                    )}
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/22 transition-transform duration-500 group-hover:scale-110" />
                    <CheckCircle2 className={cn("relative mb-4 h-5 w-5", item.icon)} />
                    <p className="relative text-sm leading-7">{item.text}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" withArrow className="mt-8">
                <Link to="/sobre">Ler sobre nossa abordagem</Link>
              </Button>
            </div>
          </Container>
        </Section>

        <Section tone="lilac" className="overflow-visible bg-[#5b3d86]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-100"
            style={{
              backgroundImage: `url("${siteImageUrl(ASSETS.texturePurple)}")`,
              backgroundPosition: "center top",
              backgroundRepeat: "repeat",
              backgroundSize: "760px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(91,61,134,0.12),rgba(38,32,51,0.08)_52%,rgba(91,61,134,0.18)),linear-gradient(to_bottom,rgba(38,32,51,0.14),transparent_38%,rgba(38,32,51,0.18))]"
          />
          <Container className="relative z-10">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <Heading
                eyebrow="Cuidado especializado"
                title="Avaliação neuropsicológica e intervenção baseada em dados"
                description="Cada família chega com uma pergunta. Nosso papel é transformar essa pergunta em avaliação, plano de intervenção e acompanhamento com metas claras."
                className="[&>p:first-child]:!text-white/78"
                titleClassName="!text-white"
                descriptionClassName="!text-white/82"
              />
              <Button asChild variant="secondary" withArrow className="md:mb-1">
                <Link to="/avaliacao-neuropsicologica">Entender a avaliação</Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.title}
                    to={service.href}
                    className={cn("group block", index % 2 === 1 && "lg:translate-y-10")}
                  >
                    <Card tone={service.tone} interactive className="relative h-full overflow-hidden">
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/55" />
                      <div className="relative mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                        <Icon className="h-5 w-5 text-[#8d63c7]" />
                      </div>
                      <h3 className="relative text-xl font-semibold text-[#262033]">{service.title}</h3>
                      <p className="relative mt-4 text-sm leading-7 text-[#5d546b]">{service.description}</p>
                      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]">
                        Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section tone="default" className="overflow-visible">
          <Container>
            <div className="relative rounded-[42px] bg-[#fff8df] p-6 shadow-[0_22px_70px_rgba(62,46,89,0.08)] sm:p-8 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[42px] opacity-70"
                style={{ backgroundImage: `url("${siteImageUrl(ASSETS.textureYellow)}")`, backgroundSize: "680px auto" }}
              />
              <div className="relative grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
                <div>
                  <Badge tone="coral" className="mb-5">Quando procurar ajuda?</Badge>
                  <Heading
                    title="Quando procurar ajuda?"
                    description="Alguns sinais merecem uma escuta especializada. Buscar orientação cedo pode reduzir angústias e abrir caminhos mais claros para a criança, os adolescentes e a família."
                    level={2}
                  />
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild withArrow>
                      <Link to="/como-saber-se-meu-filho-precisa-de-ajuda">Ver sinais de alerta</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/blog">Ler conteúdos do blog</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {alertSigns.map((sign) => (
                    <div key={sign} className="transform-gpu rounded-2xl bg-white/88 p-4 text-sm leading-6 text-[#5d546b] shadow-[0_14px_45px_rgba(62,46,89,0.07)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(62,46,89,0.14)]">
                      <CheckCircle2 className="mb-3 h-4 w-4 text-[#e8795f]" />
                      {sign}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="blue" className="overflow-visible">
          <div ref={abaSectionRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
          <img
            src={siteImageUrl(ASSETS.hand)}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 top-8 z-0 hidden w-[540px] max-w-none opacity-[0.16] will-change-transform md:block lg:-right-36 lg:w-[680px]"
            loading="lazy"
            style={{ transform: `translate3d(${abaHandOffset * 0.35}px, ${abaHandOffset}px, 0) rotate(-10deg)` }}
          />
          <Container className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.94fr] lg:items-center">
            <div>
              <Heading
                eyebrow="Terapia ABA"
                title="Terapia ABA com participação da família"
                description="A Terapia ABA na Clínica Crescer é planejada com metas individualizadas, registro de evolução e orientação para que habilidades aprendidas na sessão apareçam também em casa, na escola e na vida social."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Metas funcionais e mensuráveis.",
                  "Decisões baseadas em dados.",
                  "Orientação familiar contínua.",
                  "Generalização para a vida real.",
                ].map((item) => (
                  <Card
                    key={item}
                    tone="default"
                    className="transform-gpu transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_22px_64px_rgba(62,46,89,0.14)]"
                  >
                    <p className="text-sm leading-7 text-[#5d546b]">{item}</p>
                  </Card>
                ))}
              </div>
              <Button asChild className="mt-8" variant="secondary" withArrow>
                <Link to="/terapia-aba">Conhecer a Terapia ABA</Link>
              </Button>
            </div>
            <div className="relative min-h-[500px]">
              <div className="absolute right-0 top-0 h-[430px] w-[84%] rounded-[44px] bg-[#fff3c7]" />
              <div
                className="absolute left-0 top-10 h-[450px] w-[88%] overflow-hidden rounded-[44px] shadow-[0_30px_90px_rgba(62,46,89,0.14)]"
                style={{ clipPath: "polygon(0 10%, 100% 0, 92% 90%, 8% 100%)" }}
              >
                <HomeImage src={ASSETS.abaFamily} alt="Família em ambiente acolhedor da Clínica Crescer" className="h-full w-full" />
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="default">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.62]"
            style={{
              backgroundImage: `url("${siteImageUrl(ASSETS.patternWhite)}")`,
              backgroundPosition: "center top",
              backgroundRepeat: "repeat",
              backgroundSize: "420px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white/72"
          />
          <Container className="relative z-10">
            <Heading
              eyebrow="Respostas diretas"
              title="Desenvolvimento para crianças e adolescentes com orientação para a vida real"
              description="Informações claras e baseadas na ciência, para famílias que estão tentando entender o próximo passo com calma, segurança e acolhimento."
              align="center"
              className="mb-12"
            />
            <div className="grid gap-5 md:grid-cols-2">
              {directAnswers.map((item) => (
                <Card key={item.question} interactive>
                  <h3 className="text-lg font-semibold text-[#262033]">{item.question}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#5d546b]">{item.answer}</p>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {founder && (
          <Section tone="lilac" className="overflow-visible">
            <Container className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
              <div className="relative min-h-[520px]">
                <FloatingMark className="-left-6 -top-8" />
                <div className="absolute left-8 top-8 h-[430px] w-[78%] rounded-[52px] bg-[#dff1ff]" />
                <div className="absolute right-0 top-0 h-[500px] w-[86%] overflow-hidden rounded-[48px] shadow-[0_30px_90px_rgba(62,46,89,0.16)]">
                  <HomeImage
                    src={founder.photo_url}
                    alt={`${founder.name}, ${founder.role_title || "idealizadora da Clínica Crescer"}`}
                    className="h-full w-full"
                  />
                </div>
              </div>
              <div>
                <Badge tone="lilac" className="mb-5">Idealizadora da Crescer</Badge>
                <Heading
                  title={founder.name}
                  description={founder.role_title || "Profissional em destaque na Clínica Crescer."}
                  level={2}
                />
                {founder.bio && (
                  <p className="mt-6 max-w-2xl text-base leading-8 text-[#5d546b]">{founder.bio}</p>
                )}
                {founder.specialties && founder.specialties.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {founder.specialties.slice(0, 5).map((specialty) => (
                      <Badge key={specialty} tone="blue">{specialty}</Badge>
                    ))}
                  </div>
                )}
                <Button asChild className="mt-8" variant="secondary" withArrow>
                  <Link to="/equipe">Conhecer a equipe</Link>
                </Button>
              </div>
            </Container>
          </Section>
        )}

        <Section tone="default">
          <Container>
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <Heading
                eyebrow="Equipe"
                title="Profissionais que olham para a criança por completo"
                description="Uma equipe ativa, integrada e preparada para acolher diferentes necessidades do desenvolvimento."
              />
              <Button asChild variant="ghost" withArrow>
                <Link to="/equipe">Ver toda a equipe</Link>
              </Button>
            </div>

            {loadingContent ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-80 animate-pulse rounded-[22px] bg-[#f8f2ff]" />
                ))}
              </div>
            ) : visibleTeam.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleTeam.map((member, index) => (
                  <article
                    key={member.id}
                    className={cn(
                      "group overflow-hidden rounded-[28px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-200 hover:-translate-y-1",
                      index === 1 && "lg:translate-y-8",
                    )}
                  >
                    <div className="overflow-hidden">
                      <HomeImage
                        src={member.photo_url}
                        alt={`${member.name}, ${member.role_title || "profissional da Clínica Crescer"}`}
                        className="aspect-[4/3] min-h-0 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#262033]">{member.name}</h3>
                      {member.role_title && <p className="mt-2 text-sm font-medium text-[#8d63c7]">{member.role_title}</p>}
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {member.specialties.slice(0, 3).map((specialty) => (
                            <Badge key={specialty} tone="lilac">{specialty}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Card tone="lilac">
                <p className="text-sm leading-7 text-[#5d546b]">
                  A equipe ativa será exibida aqui automaticamente quando os perfis estiverem cadastrados no CMS.
                </p>
              </Card>
            )}
          </Container>
        </Section>

        <Section tone="lilac">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage: `url("${siteImageUrl(ASSETS.patternPurple)}")`,
              backgroundPosition: "center top",
              backgroundRepeat: "repeat",
              backgroundSize: "430px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#f8f2ff]/78"
          />
          <Container className="relative z-10">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <Heading
                eyebrow="Blog"
                title="Conteúdos para famílias que querem entender antes de decidir"
                description="Artigos sobre desenvolvimento infantil, sinais de alerta, avaliação neuropsicológica, intervenção e rotina familiar."
              />
              <Button asChild variant="secondary" withArrow>
                <Link to="/blog">Ver todos os artigos</Link>
              </Button>
            </div>

            {loadingContent ? (
              <div className="grid gap-5 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-96 animate-pulse rounded-[22px] bg-white/80" />
                ))}
              </div>
            ) : latestPosts.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {latestPosts.map((post) => (
                  <article key={post.id} className="group overflow-hidden rounded-[28px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                    <Link to={`/blog/${post.slug}`} aria-label={`Ler artigo ${post.title}`}>
                      <HomeImage
                        src={post.cover_image}
                        alt={post.title}
                        className="aspect-[16/10] min-h-0 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </Link>
                    <div className="p-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">Artigo</p>
                      <h3 className="text-xl font-semibold leading-snug text-[#262033]">
                        <Link to={`/blog/${post.slug}`} className="hover:text-[#5b3d86]">
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt && <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5d546b]">{post.excerpt}</p>}
                      <Link to={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]">
                        Ler artigo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Card tone="default">
                <BookOpen className="mb-4 h-5 w-5 text-[#8d63c7]" />
                <p className="text-sm leading-7 text-[#5d546b]">
                  Os últimos posts publicados no CMS aparecerão aqui automaticamente.
                </p>
              </Card>
            )}
          </Container>
        </Section>

        <Section tone="default">
          <Container size="content">
            <Heading
              eyebrow="Dúvidas comuns"
              title="Perguntas frequentes"
              description="Respostas claras para famílias que procuram orientação sobre avaliação, terapia, desenvolvimento e participação familiar."
              align="center"
            />
            <div className="mt-10 space-y-4">
              {faqData.map((faq) => (
                <details key={faq.question} className="group rounded-[20px] border border-[#eee7f6] bg-white p-6 shadow-[0_14px_45px_rgba(62,46,89,0.06)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                    <h3 className="text-base font-semibold text-[#262033]">{faq.question}</h3>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#8d63c7] transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-[#5d546b]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </Section>

        <Section tone="default" spacing="compact">
          <Container>
            <div className="relative overflow-hidden rounded-[42px] bg-[#5b3d86] p-7 text-white shadow-[0_30px_90px_rgba(62,46,89,0.18)] sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.18]"
                style={{ backgroundImage: `url("${siteImageUrl(ASSETS.patternWhite)}")`, backgroundSize: "420px auto" }}
              />
              <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#ffd96f]/35 blur-2xl" />
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  Vamos entender juntos o que sua família precisa agora?
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
                  Acolhemos sua dúvida com seriedade, cuidado e um plano possível. O primeiro passo pode ser uma conversa, uma avaliação ou uma orientação.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="secondary" withArrow>
                    <Link to="/quando-procurar-avaliacao">Agendar avaliação</Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-white hover:bg-white/12">
                    <Link to="/sobre">Conhecer a Clínica Crescer</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <InsuranceBenefits />

        <Section tone="lilac" spacing="compact">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: `url("${siteImageUrl(ASSETS.patternPurple)}")`, backgroundSize: "440px auto" }}
          />
          <Container className="relative">
            <div className="mb-10 max-w-3xl">
              <Badge tone="blue" className="mb-4">Unidades da Clínica Crescer</Badge>
              <h2 className="text-3xl font-semibold leading-tight text-[#262033] sm:text-4xl">
                Encontre a unidade mais próxima para sua família
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5d546b] sm:text-base">
                Atendimento especializado para crianças, adolescentes e famílias em Bragança Paulista.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {units.map((unit) => (
                <article
                  key={unit.name}
                  className="group rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_70px_rgba(62,46,89,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_82px_rgba(62,46,89,0.16)] sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f8f2ff] text-[#8d63c7]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#262033]">{unit.name}</h3>
                      <address className="mt-4 not-italic text-sm leading-7 text-[#5d546b]">
                        {unit.addressLines.map((line) => (
                          <span key={line} className="block">{line}</span>
                        ))}
                      </address>
                      <a href={unit.tel} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]">
                        <Phone className="h-4 w-4" />
                        {unit.phone}
                      </a>
                    </div>
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="sm">
                      <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Falar no WhatsApp
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <a href={unit.mapsUrl} target="_blank" rel="noreferrer">
                        <Navigation className="h-4 w-4" />
                        Ver rota
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>

        <Section tone="lilac" spacing="compact" className="pt-8 md:pt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: `url("${siteImageUrl(ASSETS.patternPurple)}")`, backgroundSize: "440px auto" }}
          />
          <Container className="relative grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div className="rounded-[34px] border border-white/75 bg-white/82 p-6 shadow-[0_22px_70px_rgba(62,46,89,0.12)] backdrop-blur-xl sm:p-8">
              <Badge tone="blue" className="mb-4">Atendimento especializado para famílias da região</Badge>
              <h2 className="text-2xl font-semibold text-[#262033]">Cuidado próximo, orientação clara e escuta responsável</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5d546b]">
                A Clínica Crescer atende famílias que procuram avaliação, intervenção e orientação especializada. Conte com uma escuta inicial cuidadosa para entender o melhor próximo passo.
              </p>
              <Button asChild className="mt-7" withArrow>
                <a href={defaultWhatsAppUrl} target="_blank" rel="noreferrer">
                  Falar com a Clínica Crescer
                </a>
              </Button>
            </div>
            <form
              onSubmit={handleContactSubmit}
              className="rounded-[34px] border border-white/75 bg-white/90 p-5 shadow-[0_24px_80px_rgba(62,46,89,0.14)] backdrop-blur-xl sm:p-7"
            >
              <h3 className="text-xl font-semibold text-[#262033]">Conte rapidamente o que motivou seu contato</h3>
              <p className="mt-3 text-sm leading-7 text-[#5d546b]">
                Essas informações ajudam nossa equipe a entender o momento da família antes da primeira conversa.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>Nome do responsável</span>
                  <input value={contactForm.guardianName} onChange={(event) => handleContactFieldChange("guardianName", event.target.value)} required className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>Nome da criança/adolescente</span>
                  <input value={contactForm.childName} onChange={(event) => handleContactFieldChange("childName", event.target.value)} required className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>Cidade</span>
                  <input value={contactForm.city} onChange={(event) => handleContactFieldChange("city", event.target.value)} required className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>Telefone/WhatsApp</span>
                  <input value={contactForm.phone} onChange={(event) => handleContactFieldChange("phone", event.target.value)} required inputMode="tel" className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>Serviço de interesse</span>
                  <select value={contactForm.interest} onChange={(event) => handleContactFieldChange("interest", event.target.value)} required className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15">
                    <option value="">Selecione</option>
                    {interestOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f]">
                  <span>O que motivou o contato?</span>
                  <select value={contactForm.reason} onChange={(event) => handleContactFieldChange("reason", event.target.value)} required className="h-12 w-full rounded-2xl border border-[#e8dff3] bg-white px-4 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15">
                    <option value="">Selecione</option>
                    {contactReasonOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[#342d3f] sm:col-span-2">
                  <span>Conte brevemente o que está acontecendo</span>
                  <textarea value={contactForm.message} onChange={(event) => handleContactFieldChange("message", event.target.value)} rows={4} className="w-full resize-none rounded-2xl border border-[#e8dff3] bg-white px-4 py-3 text-sm text-[#262033] outline-none transition focus:border-[#8d63c7] focus:ring-2 focus:ring-[#8d63c7]/15" />
                </label>
              </div>
              {contactError && <p className="mt-4 text-sm font-medium text-[#b94634]">{contactError}</p>}
              <Button type="submit" className="mt-6" withArrow>
                Enviar pelo WhatsApp
              </Button>
            </form>
          </Container>
        </Section>
      </main>
      <a
        href={defaultWhatsAppUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Clínica Crescer pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_18px_45px_rgba(37,211,102,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,211,102,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </>
  );
};

export default Index;