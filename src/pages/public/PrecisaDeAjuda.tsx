import { Link } from "react-router-dom";
import { ArrowRight, Baby, CheckCircle2, Clock3, HeartHandshake, MessageCircle } from "lucide-react";

import { BreadcrumbSchema, FAQSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Badge, Button, Container, Section } from "@/components/public";
import { cn } from "@/lib/utils";
import { siteImageUrl } from "@/styles/theme";

const WHATSAPP_URL =
  "https://wa.me/5511910163007?text=Ol%C3%A1%2C%20estava%20no%20site%20e%20gostaria%20de%20saber%20mais.";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
  patternWhite: "patterns/pattern-branco.png",
  heroImage: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/ambiente-unidades/vila-crescer.jpg",
};

const faqs = [
  {
    question: "Quais são os principais sinais de atraso no desenvolvimento?",
    answer:
      "Os principais sinais incluem atraso na fala, dificuldade de interação social, comportamentos repetitivos, dificuldades motoras e problemas de atenção. Cada criança tem seu tempo, mas persistência em certas dificuldades merece atenção profissional.",
  },
  {
    question: "A partir de que idade devo observar os marcos do desenvolvimento?",
    answer:
      "Os marcos do desenvolvimento devem ser observados desde o nascimento. Os primeiros 3 anos são cruciais para identificar possíveis atrasos. É importante estar atento a marcos como sorriso social, balbucio, primeira palavra, caminhar, entre outros.",
  },
  {
    question: "Quais profissões podem ajudar a identificar esses sinais?",
    answer:
      "Pediatras, neuropediatras, fonoaudiólogos, psicólogos, terapeutas ocupacionais e psicopedagogos são profissionais capacitados para identificar sinais de alerta no desenvolvimento infantil.",
  },
];

const ageSigns = [
  {
    title: "0-12 meses",
    items: [
      "Não sorri aos 3 meses",
      "Não segue objetos com o olhar",
      "Não balbucia aos 6 meses",
      "Não senta com apoio aos 8 meses",
    ],
    tone: "bg-[#f8f2ff] border-[#dec7ff]",
    iconTone: "bg-[#efe2ff] text-[#5b3d86]",
  },
  {
    title: "12-24 meses",
    items: [
      "Não anda aos 18 meses",
      "Não fala palavras simples",
      "Não aponta para objetos",
      "Não faz contato visual",
    ],
    tone: "bg-[#f1f9ff] border-[#dff1ff]",
    iconTone: "bg-[#dff1ff] text-[#26617e]",
  },
  {
    title: "2-3 anos",
    items: [
      "Não forma frases simples",
      "Não brinca de faz-de-conta",
      "Não interage com outras crianças",
      "Apresenta regressão de habilidades adquiridas",
    ],
    tone: "bg-[#fff8df] border-[#fff3c7]",
    iconTone: "bg-[#fff3c7] text-[#795716]",
  },
];

const actionItems = [
  "Converse com seu pediatra sobre suas observações",
  "Busque uma avaliação profissional especializada",
  "Mantenha registros do desenvolvimento da criança",
  "Não Compare seu filho com outras crianças",
];

const relatedLinks = [
  {
    href: "/sinais-de-alerta-no-desenvolvimento-infantil",
    label: "Sinais de Alerta no Desenvolvimento Infantil",
  },
  {
    href: "/quando-procurar-avaliacao",
    label: "Quando Procurar Avaliação",
  },
  {
    href: "/avaliacao-neuropsicologica",
    label: "Avaliação Neuropsicológica",
  },
];

const PrecisaDeAjuda = () => {
  return (
    <>
      <SEOHead
        title="Como Saber Se Meu Filho Precisa de Ajuda"
        description="Identifique sinais de alerta no desenvolvimento infantil e saiba quando procurar avaliação profissional. Orientações para pais."
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Precisa de Ajuda?", url: "/como-saber-se-meu-filho-precisa-de-ajuda" },
        ]}
      />
      <FAQSchema faqs={faqs} />

      <article className="bg-[#fbfafc] text-[#262033]">
        {/* Hero Section */}
        <Section className="bg-[#fbfafc] pb-20 pt-20 md:pb-24 md:pt-24" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.38] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.58), rgba(255,243,199,0.28)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 780px auto",
            }}
          />
          <div aria-hidden="true" className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#ffd96f]/35 blur-3xl" />
          <div aria-hidden="true" className="absolute left-[45%] top-20 hidden h-64 w-64 rounded-full bg-[#dff1ff]/60 blur-3xl lg:block" />

          <Container className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            {/* Left Column */}
            <div>
              <Badge tone="warm" className="mb-5">
                Orientações para pais
              </Badge>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Como Saber Se Meu Filho Precisa de Ajuda
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Identifique sinais de alerta no desenvolvimento infantil e saiba quando procurar avaliação profissional. Orientações para pais.
              </p>
              
              <div className="mt-8 rounded-2xl border border-[#eee7f6] bg-white/88 p-6 shadow-[0_14px 45px_rgba(62,46,89,0.08)] backdrop-blur-sm">
                <p className="text-sm leading-7 text-[#342d3f]">
                  Identificar sinais precocemente pode ajudar a construir caminhos mais claros para o desenvolvimento.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="flex justify-center lg:justify-end">
              <img
                src={assets.heroImage}
                alt="Vila Crescer - ambiente acolhedor da Clínica Crescer"
                className="w-full max-w-[380px] rounded-[32px] shadow-[0_20px 60px_rgba(62,46,89,0.12)] object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </Container>
        </Section>

        <Section tone="default" className="overflow-visible">
          <Container>
            <section className="mb-12">
              <div className="mb-8 max-w-3xl">
                <h2 className="text-2xl font-bold text-primary">Sinais de Alerta por Idade</h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {ageSigns.map((group) => (
                  <article
                    key={group.title}
                    className={cn(
                      "group rounded-[30px] border p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]",
                      group.tone,
                    )}
                  >
                    <div className={cn("mb-5 flex h-12 w-12 items-center justify-center rounded-2xl", group.iconTone)}>
                      <Baby className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="mb-4 text-lg font-semibold text-[#262033]">{group.title}</h3>
                    <ul className="space-y-3 text-sm leading-6 text-[#5d546b]">
                      {group.items.map((item) => (
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

            <section className="mb-12">
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                <div
                  className="relative overflow-hidden rounded-[34px] bg-[#5b3d86] p-7 text-white shadow-[0_26px_80px_rgba(62,46,89,0.16)]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.94), rgba(141,99,199,0.76)), url("${siteImageUrl(assets.patternWhite)}")`,
                    backgroundSize: "cover, 420px auto",
                  }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-white">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">O Que Fazer?</h2>
                  <p className="mt-4 text-white/84">
                    Se você identificar algum desses sinais, não entre em pânico. Cada criança
                    tem seu ritmo de desenvolvimento. O importante é:
                  </p>
                </div>

                <ol className="grid gap-4 text-muted-foreground sm:grid-cols-2">
                  {actionItems.map((item, index) => (
                    <li
                      key={item}
                      className="rounded-[24px] border border-[#eee7f6] bg-white p-5 shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]"
                    >
                      <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#efe2ff] text-sm font-semibold text-[#5b3d86]">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-6">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary">Perguntas Frequentes</h2>
              </div>
              <div className="grid gap-4">
                {faqs.map((faq) => (
                  <article
                    key={faq.question}
                    className="rounded-[24px] border border-[#eee7f6] bg-white p-6 shadow-[0_14px_45px_rgba(62,46,89,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(62,46,89,0.1)]"
                  >
                    <h3 className="mb-3 font-semibold text-[#262033]">{faq.question}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          </Container>
        </Section>

        <Section tone="lilac" spacing="compact">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`,
              backgroundSize: "440px auto",
            }}
          />
          <Container className="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <section className="rounded-[34px] border border-white/75 bg-white/88 p-7 shadow-[0_22px_70px_rgba(62,46,89,0.12)] backdrop-blur-xl sm:p-8">
              <h3 className="text-2xl font-semibold text-[#262033]">Quando a dúvida aparece, uma conversa pode ajudar.</h3>
              <p className="mt-4 text-sm leading-7 text-[#5d546b]">
                A Clínica Crescer acolhe famílias que precisam entender sinais, próximos passos e possibilidades de avaliação.
              </p>
              <Button asChild className="mt-7" withArrow>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Falar pelo WhatsApp
                </a>
              </Button>
            </section>

            <section className="rounded-[34px] border border-white/75 bg-white/82 p-6 shadow-[0_22px_70px_rgba(62,46,89,0.1)] backdrop-blur-xl">
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

export default PrecisaDeAjuda;