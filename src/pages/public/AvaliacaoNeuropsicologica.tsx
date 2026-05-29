import { Link } from "react-router-dom";
import { ArrowRight, Brain, CheckCircle2, ClipboardList, FileText, MessageCircle, Puzzle } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Container, Section } from "@/components/public";
import { cn } from "@/lib/utils";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
  patternWhite: "patterns/pattern-branco.png",
  heroImage: "ambiente-unidades/avaliacao-neuro-image.png",
  icon: "icons/icone.png",
};

const evaluatedItems = [
  {
    title: "Funções Cognitivas",
    description: "Atenção, concentração, memória, raciocínio e resolução de problemas.",
    tone: "border-[#dec7ff] bg-[#f8f2ff]",
    iconTone: "bg-[#efe2ff] text-[#5b3d86]",
  },
  {
    title: "Linguagem",
    description: "Compreensão, expressão, leitura e escrita.",
    tone: "border-[#dff1ff] bg-[#f1f9ff]",
    iconTone: "bg-[#dff1ff] text-[#26617e]",
  },
  {
    title: "Funções Executivas",
    description: "Planejamento, organização, flexibilidade mental e controle de impulsos.",
    tone: "border-[#fff3c7] bg-[#fff8df]",
    iconTone: "bg-[#fff3c7] text-[#795716]",
  },
  {
    title: "Habilidades Motoras",
    description: "Coordenação fina e grossa, velocidade e precisão de movimentos.",
    tone: "border-[#ffe1d5] bg-[#fff4ef]",
    iconTone: "bg-[#ffe1d5] text-[#9a4b3b]",
  },
];

const processSteps = [
  {
    number: "1.",
    label: "Anamnese:",
    text: "Entrevista com os pais para histórico de desenvolvimento, saúde e contexto familiar.",
  },
  {
    number: "2.",
    label: "Aplicação de Testes:",
    text: "Realização de testes padronizados em sessões individuais com a criança.",
  },
  {
    number: "3.",
    label: "Análise dos Resultados:",
    text: "Neuropsicólogo analisa os dados e prepara um relatório detalhado.",
  },
  {
    number: "4.",
    label: "Devolutiva:",
    text: "Reunião com os pais para apresentar resultados e orientações.",
  },
];

const benefits = [
  "Identificação precisa de dificuldades e potencialidades",
  "Diagnóstico diferencial de condições como TDAH, TEA, dislexia",
  "Orientação para estratégias de intervenção adequadas",
  "Base para adaptações escolares quando necessário",
  "Acompanhamento da evolução ao longo do tempo",
];

const relatedLinks = [
  { href: "/quando-procurar-avaliacao", label: "Quando Procurar Avaliação" },
  { href: "/terapia-aba", label: "Terapia ABA" },
  { href: "/sobre", label: "Conheça Nossa Equipe" },
];

const AvaliacaoNeuropsicologica = () => {
  return (
    <>
      <SEOHead
        title="Avaliação Neuropsicológica"
        description="Entenda o que é a avaliação neuropsicológica, como funciona e como pode ajudar no desenvolvimento infantil."
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Avaliação Neuropsicológica", url: "/avaliacao-neuropsicologica" },
        ]}
      />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-16 pt-14 md:pb-20 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.78] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.64), rgba(255,243,199,0.28)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 780px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#fbfafc]/72 to-[#fbfafc]"
          />
          <div aria-hidden="true" className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#ffd96f]/30 blur-3xl" />
          <div aria-hidden="true" className="absolute left-[46%] top-20 hidden h-64 w-64 rounded-full bg-[#dff1ff]/55 blur-3xl lg:block" />

          <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <header>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Avaliação Neuropsicológica
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Entenda o que é a avaliação neuropsicológica, como funciona e como pode ajudar no desenvolvimento infantil.
              </p>
            </header>

            <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[400px]">
              <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#efe2ff]/70 blur-2xl" />
              <div
                aria-hidden="true"
                className="absolute right-8 top-10 h-44 w-44 rounded-[44px] opacity-80 shadow-[0_22px_70px_rgba(62,46,89,0.1)]"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.9), rgba(141,99,199,0.72)), url("${siteImageUrl(assets.patternPurple)}")`,
                  backgroundSize: "cover, 360px auto",
                  transform: "rotate(8deg)",
                }}
              />
              <img
                src={siteImageUrl(assets.heroImage)}
                alt="Crianças da Clínica Crescer"
                className="relative z-10 mx-auto h-auto w-[88%] max-w-[520px] object-contain motion-safe:animate-[kidsFloat_12000ms_ease-in-out_infinite] lg:ml-auto lg:mr-0"
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
                    <Brain className="h-5 w-5" />
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-primary">O que é Avaliação Neuropsicológica?</h2>
                  <p className="mb-4 text-muted-foreground">
                    A avaliação neuropsicológica é um processo detalhado que investiga o
                    funcionamento cognitivo, emocional e comportamental de uma pessoa.
                    No contexto infantil, é fundamental para entender como a criança
                    aprende, processa informações e se comporta.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl font-bold text-primary">O que é Avaliado?</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {evaluatedItems.map((item) => (
                  <article
                    key={item.title}
                    className={cn(
                      "group rounded-[30px] border p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]",
                      item.tone,
                    )}
                  >
                    <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl", item.iconTone)}>
                      <Puzzle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold text-[#262033]">{item.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl font-bold text-primary">Como Funciona o Processo?</h2>
              </div>

              <ol className="relative space-y-5 text-muted-foreground before:absolute before:left-6 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-[#dec7ff]">
                {processSteps.map((step) => (
                  <li key={step.number} className="relative flex gap-4">
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5b3d86] text-sm font-bold text-white shadow-[0_14px_45px_rgba(91,61,134,0.22)]">
                      {step.number}
                    </span>
                    <div className="rounded-[24px] border border-[#eee7f6] bg-white p-5 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(62,46,89,0.1)]">
                      <strong>{step.label}</strong> {step.text}
                    </div>
                  </li>
                ))}
              </ol>
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
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <h2 className="mb-5 text-2xl font-bold text-white">Benefícios da Avaliação</h2>
                  <ul className="grid gap-3 text-white/86 md:grid-cols-2">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-2 text-sm leading-7">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#ffd96f]" />
                        <span>{benefit}</span>
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

export default AvaliacaoNeuropsicologica;
