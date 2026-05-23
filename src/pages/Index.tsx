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
  SectionDivider,
  SoftBackground,
} from "@/components/public";
import { siteImageUrl } from "@/styles/theme";
import { blogService, BlogPost } from "@/services/blogService";
import { staffService, StaffMember } from "@/services/staffService";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Avaliacao Neuropsicologica",
    description:
      "Investigacao cuidadosa das habilidades cognitivas, emocionais e comportamentais para orientar decisoes clinicas e escolares.",
    href: "/avaliacao-neuropsicologica",
    icon: Brain,
    tone: "lilac" as const,
  },
  {
    title: "Terapia ABA",
    description:
      "Intervencao baseada em evidencias para desenvolver comunicacao, autonomia, aprendizagem e habilidades sociais.",
    href: "/terapia-aba",
    icon: Puzzle,
    tone: "blue" as const,
  },
  {
    title: "Orientacao Familiar",
    description:
      "Acolhimento e estrategias praticas para que a familia participe do processo com seguranca e clareza.",
    href: "/orientacao-parental",
    icon: HeartHandshake,
    tone: "warm" as const,
  },
  {
    title: "Desenvolvimento Infantil",
    description:
      "Olhar integral para marcos do desenvolvimento, comportamento, linguagem, rotina e participacao social.",
    href: "/como-saber-se-meu-filho-precisa-de-ajuda",
    icon: Sparkles,
    tone: "coral" as const,
  },
];

const alertSigns = [
  "Atrasos na fala, linguagem ou comunicacao",
  "Pouco contato visual ou dificuldade de interacao",
  "Crises frequentes, rigidez ou seletividade intensa",
  "Dificuldades escolares persistentes",
  "Regressao de habilidades ja adquiridas",
  "Duvidas da familia sobre desenvolvimento ou comportamento",
];

const faqData = [
  {
    question: "Quando procurar avaliacao para uma crianca?",
    answer:
      "Vale procurar avaliacao quando ha atrasos em marcos do desenvolvimento, dificuldades de aprendizagem, alteracoes importantes de comportamento, suspeita de TEA, TDAH ou quando a familia sente que precisa entender melhor o desenvolvimento da crianca.",
  },
  {
    question: "A Clinica Crescer atende quais publicos?",
    answer:
      "A Clinica Crescer acompanha criancas, adolescentes e familias, com foco em desenvolvimento infantil, avaliacao neuropsicologica, terapia ABA, orientacao familiar e intervencoes multidisciplinares.",
  },
  {
    question: "Como funciona a primeira etapa de atendimento?",
    answer:
      "O processo costuma comecar com escuta da familia, levantamento de historico, compreensao da rotina e definicao do melhor caminho: avaliacao, intervencao, orientacao familiar ou encaminhamento complementar.",
  },
  {
    question: "A familia participa do tratamento?",
    answer:
      "Sim. A familia e parte essencial do processo. O objetivo e transformar o que acontece na clinica em estrategias possiveis para casa, escola e vida diaria.",
  },
  {
    question: "Terapia ABA e indicada apenas para autismo?",
    answer:
      "Nao. A ABA e muito utilizada em casos de TEA, mas seus principios tambem podem apoiar desenvolvimento de habilidades, comportamento, comunicacao e autonomia em diferentes perfis, sempre com plano individualizado.",
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
          "flex min-h-[320px] items-center justify-center rounded-[32px] bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]",
          className,
        )}
      >
        <div className="h-24 w-24 rounded-full bg-white/70 shadow-[0_22px_70px_rgba(62,46,89,0.12)]" />
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
      className={cn("h-full w-full rounded-[32px] object-cover", className)}
    />
  );
};

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
    name: "Clinica Crescer",
    description:
      "Clinica especializada em desenvolvimento infantil, avaliacao neuropsicologica, terapia ABA e orientacao familiar.",
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
        title="Clinica Crescer | Desenvolvimento infantil com cuidado e ciencia"
        description="A Clinica Crescer oferece avaliacao neuropsicologica, terapia ABA, orientacao familiar e acompanhamento multidisciplinar para criancas, adolescentes e familias."
        keywords="clinica crescer, desenvolvimento infantil, avaliacao neuropsicologica, terapia ABA, orientacao familiar, sinais de alerta infantil, neuropsicologia infantil"
        ogImage={siteImageUrl("home/clinica-crescer-og.jpg")}
        ogType="website"
        schema={homeSchema}
      />
      <MedicalClinicSchema />
      <FAQSchema faqs={faqData} />

      <main className="bg-[#fbfafc] text-[#262033]">
        <Section className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,#fbfafc_0%,#ffffff_56%,#f8f2ff_100%)] pt-16 md:pt-20" spacing="compact">
          <Container className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative z-10">
              <Badge tone="warm" className="mb-6">
                Desenvolvimento infantil com ciencia, escuta e presenca
              </Badge>
              <Heading
                level={1}
                title="Cuidar do desenvolvimento e tambem cuidar da familia."
                description="Na Clinica Crescer, avaliacao e intervencao se encontram com acolhimento humano para transformar duvidas em caminhos claros para a vida real."
                descriptionClassName="text-lg sm:text-xl"
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" withArrow>
                  <Link to="/como-saber-se-meu-filho-precisa-de-ajuda">Preciso de ajuda</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/sobre">Conhecer a clinica</Link>
                </Button>
              </div>
              <div className="mt-9 grid gap-3 text-sm text-[#5d546b] sm:grid-cols-3">
                {["Equipe multidisciplinar", "Plano individualizado", "Familia como parceira"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#8d63c7]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-[28px] bg-[#fff3c7] lg:block" />
              <div className="absolute -right-5 bottom-16 hidden h-20 w-20 rounded-full bg-[#dff1ff] lg:block" />
              <div className="relative overflow-hidden rounded-[36px] bg-white p-3 shadow-[0_22px_70px_rgba(62,46,89,0.12)]">
                <HomeImage
                  src="home/hero-familia.jpg"
                  alt="Familia acolhida pela Clinica Crescer"
                  priority
                  className="aspect-[4/5] min-h-[440px]"
                />
                <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/92 p-5 shadow-[0_14px_45px_rgba(62,46,89,0.1)] backdrop-blur">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#8d63c7]" />
                    <p className="text-sm leading-6 text-[#5d546b]">
                      Um espaco para investigar, orientar e acompanhar cada crianca com respeito ao seu tempo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="default">
          <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Heading
              eyebrow="Sobre a Clinica Crescer"
              title="Um cuidado multidisciplinar, claro e profundamente humano."
              description="A Clinica Crescer nasceu para apoiar familias que precisam compreender melhor o desenvolvimento de seus filhos, com olhar tecnico, linguagem acessivel e intervencoes que fazem sentido fora da sessao."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Avaliacao para orientar decisoes com mais seguranca.",
                "Intervencoes conectadas a rotina da crianca e da familia.",
                "Equipe integrada para enxergar o desenvolvimento por varios angulos.",
                "Acompanhamento que valoriza vinculo, autonomia e qualidade de vida.",
              ].map((item) => (
                <Card key={item} interactive>
                  <CheckCircle2 className="mb-5 h-5 w-5 text-[#8d63c7]" />
                  <p className="text-sm leading-7 text-[#5d546b]">{item}</p>
                </Card>
              ))}
            </div>
            <div className="lg:col-start-2">
              <Button asChild variant="ghost" withArrow>
                <Link to="/sobre">Ler sobre nossa abordagem</Link>
              </Button>
            </div>
          </Container>
        </Section>

        <Section tone="lilac">
          <Container>
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <Heading
                eyebrow="Servicos"
                title="Caminhos de cuidado para diferentes necessidades."
                description="Cada familia chega com uma pergunta. Nosso papel e ajudar a transformar essa pergunta em avaliacao, plano e acompanhamento."
              />
              <Button asChild variant="secondary" withArrow className="md:mb-1">
                <Link to="/avaliacao-neuropsicologica">Explorar servicos</Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.title} to={service.href} className="group block">
                    <Card tone={service.tone} interactive className="h-full">
                      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                        <Icon className="h-5 w-5 text-[#8d63c7]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#262033]">{service.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[#5d546b]">{service.description}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]">
                        Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            <SoftBackground image="home/precisa-de-ajuda.jpg" fallbackTone="warm" className="p-6 sm:p-8 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <Badge tone="coral" className="mb-5">Precisa de ajuda?</Badge>
                  <Heading
                    title="Se algo no desenvolvimento preocupa, voce nao precisa esperar sozinho."
                    description="Alguns sinais merecem uma escuta especializada. Buscar orientacao cedo pode trazer clareza, reduzir angustias e abrir caminhos mais gentis para a crianca."
                    level={2}
                  />
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild withArrow>
                      <Link to="/como-saber-se-meu-filho-precisa-de-ajuda">Ver sinais de alerta</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/quando-procurar-avaliacao">Quando procurar avaliacao</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {alertSigns.map((sign) => (
                    <div key={sign} className="rounded-2xl bg-white/86 p-4 text-sm leading-6 text-[#5d546b] shadow-[0_14px_45px_rgba(62,46,89,0.07)]">
                      <CheckCircle2 className="mb-3 h-4 w-4 text-[#e8795f]" />
                      {sign}
                    </div>
                  ))}
                </div>
              </div>
            </SoftBackground>
          </Container>
        </Section>

        {founder && (
          <Section tone="blue">
            <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative">
                <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-[#fff3c7]" />
                <HomeImage
                  src={founder.photo_url}
                  alt={`${founder.name}, ${founder.role_title || "idealizadora da Clinica Crescer"}`}
                  className="relative aspect-[4/5] min-h-[420px] shadow-[0_22px_70px_rgba(62,46,89,0.12)]"
                />
              </div>
              <div>
                <Badge tone="lilac" className="mb-5">Idealizadora em destaque</Badge>
                <Heading
                  title={founder.name}
                  description={founder.role_title || "Profissional em destaque na Clinica Crescer."}
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
                title="Profissionais que olham para a crianca inteira."
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
                {visibleTeam.map((member) => (
                  <article key={member.id} className="overflow-hidden rounded-[24px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                    <HomeImage
                      src={member.photo_url}
                      alt={`${member.name}, ${member.role_title || "profissional da Clinica Crescer"}`}
                      className="aspect-[4/3] min-h-0 rounded-none"
                    />
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
                  A equipe ativa sera exibida aqui automaticamente quando os perfis estiverem cadastrados no CMS.
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
                title="Conteudo para familias que querem entender antes de decidir."
                description="Artigos sobre desenvolvimento infantil, sinais de alerta, avaliacao, intervencao e rotina familiar."
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
                  <article key={post.id} className="group overflow-hidden rounded-[24px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                    <Link to={`/blog/${post.slug}`} aria-label={`Ler artigo ${post.title}`}>
                      <HomeImage
                        src={post.cover_image}
                        alt={post.title}
                        className="aspect-[16/10] min-h-0 rounded-none transition-transform duration-300 group-hover:scale-[1.03]"
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
                  Os ultimos posts publicados no CMS aparecerao aqui automaticamente.
                </p>
              </Card>
            )}
          </Container>
        </Section>

        <Section tone="default">
          <Container size="content">
            <Heading
              eyebrow="Perguntas frequentes"
              title="Respostas diretas para comecar com mais clareza."
              description="Informacoes pensadas para familias e tambem para motores de busca entenderem melhor o cuidado oferecido pela Clinica Crescer."
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
            <CTABox
              title="Vamos entender juntos o que sua familia precisa agora?"
              description="Acolhemos sua duvida com seriedade, cuidado e um plano possivel. O primeiro passo pode ser uma conversa, uma avaliacao ou uma orientacao."
            >
              <Button asChild variant="secondary" withArrow>
                <Link to="/quando-procurar-avaliacao">Agendar avaliacao</Link>
              </Button>
              <Button asChild variant="ghost" className="text-white hover:bg-white/12">
                <Link to="/sobre">Conhecer a Clinica Crescer</Link>
              </Button>
            </CTABox>
          </Container>
        </Section>

        <Section tone="lilac" spacing="compact">
          <PatternOverlay />
          <Container className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[#262033]">Clinica Crescer</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#5d546b]">
                Desenvolvimento infantil, avaliacao neuropsicologica, terapia ABA e orientacao familiar com uma abordagem humana, tecnica e integrada.
              </p>
            </div>
            <nav aria-label="Links institucionais">
              <h3 className="text-sm font-semibold text-[#262033]">Institucional</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#5d546b]">
                <li><Link className="hover:text-[#5b3d86]" to="/sobre">Sobre</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/equipe">Equipe</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/blog">Blog</Link></li>
              </ul>
            </nav>
            <nav aria-label="Servicos principais">
              <h3 className="text-sm font-semibold text-[#262033]">Servicos</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#5d546b]">
                <li><Link className="hover:text-[#5b3d86]" to="/avaliacao-neuropsicologica">Avaliacao Neuropsicologica</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/terapia-aba">Terapia ABA</Link></li>
                <li><Link className="hover:text-[#5b3d86]" to="/orientacao-parental">Orientacao Familiar</Link></li>
              </ul>
            </nav>
          </Container>
        </Section>

        <SectionDivider />
      </main>
    </>
  );
};

export default Index;
