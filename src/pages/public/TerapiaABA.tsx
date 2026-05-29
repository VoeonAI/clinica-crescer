import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Database, HeartHandshake, Puzzle, Sparkles, Users } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Container, Section } from "@/components/public";
import { cn } from "@/lib/utils";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
  patternWhite: "patterns/pattern-branco.png",
  heroImage: "ambiente-unidades/aba-crescer.png",
  hand: "svg-animado/crescer-logoforma-animada-carregando.svg",
};

const principles = [
  {
    title: "Reforço Positivo",
    description:
      "Uso de consequências positivas para aumentar comportamentos desejáveis, tornando a aprendizagem motivadora.",
    tone: "border-[#dec7ff] bg-[#f8f2ff]",
    iconTone: "bg-[#efe2ff] text-[#5b3d86]",
    icon: Sparkles,
  },
  {
    title: "Análise de Dados",
    description:
      "Registro sistemático do progresso para garantir que as intervenções são eficazes e fazer ajustes quando necessário.",
    tone: "border-[#dff1ff] bg-[#f1f9ff]",
    iconTone: "bg-[#dff1ff] text-[#26617e]",
    icon: Database,
  },
  {
    title: "Individualização",
    description:
      "Cada programa é desenvolvido especificamente para as necessidades únicas de cada criança e família.",
    tone: "border-[#fff3c7] bg-[#fff8df]",
    iconTone: "bg-[#fff3c7] text-[#795716]",
    icon: Puzzle,
  },
];

const skills = [
  {
    title: "Comunicação",
    items: ["Linguagem verbal", "Comunicação alternativa", "Compreensão de instruções"],
    tone: "border-[#dec7ff] bg-[#f8f2ff]",
  },
  {
    title: "Socialização",
    items: ["Interação com pares", "Compartilhamento", "Jogos cooperativos"],
    tone: "border-[#dff1ff] bg-[#f1f9ff]",
  },
  {
    title: "Autonomia",
    items: ["Habilidades de autocuidado", "Rotinas diárias", "Independência"],
    tone: "border-[#ffe1d5] bg-[#fff4ef]",
  },
  {
    title: "Acadêmico",
    items: ["Pré-requisitos escolares", "Atenção e seguimento de instruções", "Habilidades de aprendizagem"],
    tone: "border-[#fff3c7] bg-[#fff8df]",
  },
];

const familyItems = [
  "Participar de sessões de treinamento",
  "Aplicar estratégias no dia a dia",
  "Manter consistência entre terapia e casa",
  "Comunicar dúvidas e progressos à equipe",
];

const relatedLinks = [
  { href: "/avaliacao-neuropsicologica", label: "Avaliação Neuropsicológica" },
  { href: "/orientacao-parental", label: "Orientação Parental" },
  { href: "/sobre", label: "Nossa Equipe" },
];

const TerapiaABA = () => {
  return (
    <>
      <SEOHead
        title="Terapia ABA"
        description="Conheça a Análise do Comportamento Aplicada (ABA), uma abordagem cientificamente comprovada para desenvolvimento infantil."
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Terapia ABA", url: "/terapia-aba" },
        ]}
      />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-20 pt-16 md:pb-28 md:pt-28" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.78] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.64), rgba(255,243,199,0.28)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 880px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#fbfafc]/72 to-[#fbfafc]"
          />
          <div aria-hidden="true" className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#ffd96f]/30 blur-3xl" />
          <div aria-hidden="true" className="absolute left-[46%] top-20 hidden h-64 w-64 rounded-full bg-[#dff1ff]/55 blur-3xl lg:block" />

          <Container className="relative z-10 grid min-h-[620px] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <header>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Terapia ABA
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Conheça a Análise do Comportamento Aplicada (ABA), uma abordagem cientificamente comprovada para desenvolvimento infantil.
              </p>
            </header>

            <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
              <img
                src={siteImageUrl(assets.hand)}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 top-4 z-20 h-36 w-36 object-contain opacity-20"
                loading="lazy"
              />
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dff1ff]/45 blur-2xl" />
              <img
                src={siteImageUrl(assets.heroImage)}
                alt="Família em ambiente acolhedor da Clínica Crescer"
                className="relative z-10 mx-auto h-auto w-[94%] max-w-[640px] object-contain motion-safe:animate-[kidsFloat_12000ms_ease-in-out_infinite] lg:ml-auto lg:mr-0 lg:w-[112%] lg:max-w-[760px]"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </Container>
        </Section>

        <Section tone="default" className="overflow-visible">
          <Container>
            <section className="mb-12">
              <div className="relative overflow-hidden rounded-[36px] border border-[#eee7f6] bg-white p-7 shadow-[0_22px_70px_rgba(62,46,89,0.1)] transition-all duration-300 hover:-translate-y-1 sm:p-9">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#fff3c7]" />
                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe2ff] text-[#5b3d86]">
                    <Puzzle className="h-5 w-5" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-primary">O que é Terapia ABA?</h2>
                  <p className="mb-4 text-muted-foreground">
                    A Análise do Comportamento Aplicada (ABA) é uma ciência que estuda o
                    comportamento humano e utiliza princípios de aprendizagem para ensinar
                    habilidades e reduzir comportamentos desafiadores. É especialmente
                    eficaz no tratamento do Transtorno do Espectro Autista (TEA).
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl font-bold text-primary">Princípios Fundamentais</h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {principles.map((principle) => {
                  const Icon = principle.icon;
                  return (
                    <article
                      key={principle.title}
                      className={cn(
                        "group rounded-[30px] border p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]",
                        principle.tone,
                      )}
                    >
                      <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl", principle.iconTone)}>
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <h3 className="mb-3 text-lg font-semibold text-[#262033]">{principle.title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">{principle.description}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl font-bold text-primary">Habilidades Trabalhadas</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {skills.map((skill) => (
                  <article
                    key={skill.title}
                    className={cn(
                      "rounded-[28px] border p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]",
                      skill.tone,
                    )}
                  >
                    <h4 className="mb-4 text-lg font-semibold text-[#262033]">{skill.title}</h4>
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      {skill.items.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8d63c7]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div
                className="relative overflow-hidden rounded-[34px] bg-[#5b3d86] p-7 text-white shadow-[0_26px_80px_rgba(62,46,89,0.16)] sm:p-8"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.94), rgba(141,99,199,0.72)), url("${siteImageUrl(assets.patternWhite)}")`,
                  backgroundSize: "cover, 420px auto",
                }}
              >
                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-white">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Envolvimento da Família</h2>
                  <p className="mb-4 text-white/84">
                    O sucesso da terapia ABA depende fortemente do envolvimento da família.
                    Os pais são orientados a:
                  </p>
                  <ul className="grid gap-3 text-white/86 md:grid-cols-2">
                    {familyItems.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-7">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#ffd96f]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </Container>
        </Section>

        <Section tone="lilac" spacing="compact">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`,
              backgroundSize: "440px auto",
            }}
          />
          <Container size="content" className="relative">
            <section className="rounded-[34px] border border-white/75 bg-white/88 p-6 shadow-[0_22px_70px_rgba(62,46,89,0.12)] backdrop-blur-xl sm:p-8">
              <h3 className="mb-4 font-semibold text-[#262033]">Veja também</h3>
              <ul className="space-y-3 text-sm">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-[#eee7f6] bg-white/86 px-4 py-3 font-semibold text-[#5b3d86] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dec7ff] hover:bg-[#f8f2ff]"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Container>
        </Section>
      </article>
    </>
  );
};

export default TerapiaABA;
