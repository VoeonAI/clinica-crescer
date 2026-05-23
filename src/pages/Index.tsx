import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  HeartHandshake,
  Puzzle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SEOHead } from "@/components/SEOHead";
import { FAQSchema, MedicalClinicSchema } from "@/components/Schemas";
import {
  Badge,
  Button,
  Card,
  Container,
  CTABox,
  Heading,
  PatternOverlay,
  Section,
  SoftBackground,
} from "@/components/public";
import { siteImageUrl } from "@/styles/theme";
import { blogService, BlogPost } from "@/services/blogService";
import { staffService, StaffMember } from "@/services/staffService";
import { cn } from "@/lib/utils";

const ASSETS = {
  hero: "ambiente-unidades/recepcao-clinica-crescer.jpg",
  about: "ambiente-unidades/ambiente-crescer.jpg",
  facade: "ambiente-unidades/fachada-unidade-criancas-crescer.jpg",
  village: "ambiente-unidades/vila-crescer.jpg",
  texturePurple: "backgrounds/textura-roxa.png",
  textureYellow: "backgrounds/textura-amarela.png",
  patternWhite: "patterns/pattern-branco.png",
  patternPurple: "patterns/pattern-roxo.png",
  icon: "icons/icone.png",
  animatedSvg: "svg-animado/crescer-logoforma-animada-carregando.svg",
};

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

const Index = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

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
        <Section className="min-h-[calc(100vh-5rem)] bg-[#fbfafc] pt-14 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[70%] opacity-[0.08]"
            style={{ backgroundImage: `url("${siteImageUrl(ASSETS.texturePurple)}")`, backgroundSize: "760px auto" }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#fff3c7]/70 blur-3xl"
          />
          <Container className="grid items-center gap-12 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="relative z-10">
              <Badge tone="warm" className="mb-6">
                Desenvolvimento infantil com orientação para a vida real
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
              <div className="mt-9 grid gap-3 text-sm text-[#5d546b] sm:grid-cols-3">
                {["Equipe multidisciplinar", "Decisões baseadas em dados", "Família como parceira"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8d63c7]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[540px]">
              <FloatingMark className="-right-4 -top-10" />
              <div className="absolute left-2 top-6 h-[420px] w-[78%] rounded-[44px] bg-[#efe2ff]" />
              <div
                className="absolute right-0 top-0 h-[500px] w-[82%] overflow-hidden rounded-[46px] shadow-[0_30px_90px_rgba(62,46,89,0.16)]"
                style={{ clipPath: "polygon(9% 0, 100% 0, 92% 100%, 0 92%)" }}
              >
                <HomeImage src={ASSETS.hero} alt="Recepção acolhedora da Clínica Crescer" priority className="h-full w-full" />
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-52 w-72 rounded-[38px] opacity-80 shadow-[0_22px_70px_rgba(62,46,89,0.12)]"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,243,199,0.82)), url("${siteImageUrl(ASSETS.patternPurple)}")`,
                  backgroundSize: "cover, 320px auto",
                }}
              />
              <div className="absolute bottom-8 left-8 max-w-xs rounded-[28px] bg-white/94 p-5 shadow-[0_14px_45px_rgba(62,46,89,0.12)] backdrop-blur">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#8d63c7]" />
                  <p className="text-sm leading-6 text-[#5d546b]">
                    Um espaço preparado para acolher dúvidas, orientar famílias e acompanhar cada criança com respeito ao seu tempo.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="default" className="overflow-visible">
          <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-8 -top-8 hidden h-40 w-40 rounded-full bg-[#dff1ff] lg:block" />
              <div
                className="relative h-[460px] overflow-hidden rounded-[46px] shadow-[0_30px_90px_rgba(62,46,89,0.14)]"
                style={{ clipPath: "polygon(0 0, 100% 8%, 94% 100%, 8% 94%)" }}
              >
                <HomeImage src={ASSETS.about} alt="Ambiente terapêutico da Clínica Crescer" className="h-full w-full" />
              </div>
              <Card className="absolute -bottom-8 right-4 max-w-sm bg-white/95 backdrop-blur">
                <p className="text-sm leading-7 text-[#5d546b]">
                  A clínica foi pensada para unir técnica, conforto e acolhimento em uma experiência menos fria e mais humana.
                </p>
              </Card>
            </div>

            <div className="relative order-1 lg:order-2">
              <Heading
                eyebrow="Conheça a Clínica Crescer"
                title="Conheça a Clínica Crescer"
                description="Somos uma clínica especializada em desenvolvimento infantil, avaliação neuropsicológica, Terapia ABA e orientação familiar. Nosso trabalho combina ciência, acolhimento e uma visão funcional do desenvolvimento."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Avaliação para orientar decisões clínicas e escolares com mais segurança.",
                  "Intervenções conectadas à rotina da criança, da família e da escola.",
                  "Equipe integrada para enxergar o desenvolvimento por vários ângulos.",
                  "Acompanhamento que valoriza vínculo, autonomia e qualidade de vida.",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-[#eee7f6] bg-white/80 p-5 shadow-[0_14px_45px_rgba(62,46,89,0.06)]">
                    <CheckCircle2 className="mb-4 h-5 w-5 text-[#8d63c7]" />
                    <p className="text-sm leading-7 text-[#5d546b]">{item}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="ghost" withArrow className="mt-8">
                <Link to="/sobre">Ler sobre nossa abordagem</Link>
              </Button>
            </div>
          </Container>
        </Section>

        <Section tone="lilac" className="overflow-visible">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.09]"
            style={{ backgroundImage: `url("${siteImageUrl(ASSETS.patternPurple)}")`, backgroundSize: "460px auto" }}
          />
          <Container className="relative">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <Heading
                eyebrow="Cuidado especializado"
                title="Avaliação neuropsicológica e intervenção baseada em dados"
                description="Cada família chega com uma pergunta. Nosso papel é transformar essa pergunta em avaliação, plano de intervenção e acompanhamento com metas claras."
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
                className="absolute inset-0 rounded-[42px] opacity-[0.16]"
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
                    <div key={sign} className="rounded-2xl bg-white/88 p-4 text-sm leading-6 text-[#5d546b] shadow-[0_14px_45px_rgba(62,46,89,0.07)]">
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
          <Container className="grid gap-12 lg:grid-cols-[1fr_0.94fr] lg:items-center">
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
                  <Card key={item} tone="default">
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
                <HomeImage src={ASSETS.facade} alt="Fachada da unidade da Clínica Crescer para crianças" className="h-full w-full" />
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            <Heading
              eyebrow="Respostas diretas"
              title="Desenvolvimento infantil com orientação para a vida real"
              description="Informações claras para famílias que estão tentando entender o próximo passo com calma, segurança e acolhimento."
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
                <Badge tone="lilac" className="mb-5">Idealizadora em destaque</Badge>
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
                title="Profissionais que olham para a criança inteira"
                description="Uma equipe ativa, integrada e preparada para acolher diferentes necessidades do desenvolvimento."
              />
              <Button asChild variant="ghost" withArrow>
                <Link to="/equipe">Ver equipe completa</Link>
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
          <Container>
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

        <Section tone="lilac" spacing="compact">
          <PatternOverlay />
          <Container className="relative grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <Badge tone="blue" className="mb-4">Atendimento especializado para famílias da região</Badge>
              <h2 className="text-2xl font-semibold text-[#262033]">Cuidado próximo, orientação clara e escuta responsável</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5d546b]">
                A Clínica Crescer atende famílias que procuram avaliação, intervenção e orientação especializada. Endereço, telefone e WhatsApp podem ser conectados aqui quando os dados oficiais forem definidos no projeto.
              </p>
            </div>
            <SoftBackground image={ASSETS.facade} fallbackTone="blue" className="min-h-[280px] p-6" />
          </Container>
        </Section>
      </main>
    </>
  );
};

export default Index;
