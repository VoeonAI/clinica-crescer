import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Users } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Container, Section } from "@/components/public";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
};

const productGroups = [
  {
    title: "Produtos desenvolvidos no Gamelabs",
    description: "Conheça criações digitais e materiais pensados para apoiar desenvolvimento, aprendizagem e rotina.",
    href: "/produtos/gamelabs",
    icon: FlaskConical,
    tone: "from-[#f8f2ff] to-[#efe2ff]",
  },
  {
    title: "Produtos criados pela nossa equipe",
    description: "Materiais desenvolvidos por profissionais da Clínica Crescer para famílias, crianças e adolescentes.",
    href: "/produtos/equipe",
    icon: Users,
    tone: "from-[#fff8df] to-[#fff3c7]",
  },
];

const Produtos = () => {
  return (
    <>
      <SEOHead
        title="Produtos"
        description="Produtos desenvolvidos no Gamelabs e criados pela equipe da Clínica Crescer."
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Produtos", url: "/produtos" }]} />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-16 pt-14 md:pb-20 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.78] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.68), rgba(255,243,199,0.28)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 780px auto",
            }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#fbfafc]/72 to-[#fbfafc]" />
          <Container className="relative z-10">
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
              Produtos
            </h1>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {productGroups.map((group) => {
                const Icon = group.icon;

                return (
                  <Link
                    key={group.href}
                    to={group.href}
                    className="group relative overflow-hidden rounded-[34px] border border-[#eee7f6] bg-white p-7 shadow-[0_22px_70px_rgba(62,46,89,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(62,46,89,0.15)] sm:p-8"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${group.tone} opacity-70`} />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-[0.16]"
                      style={{ backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`, backgroundSize: "420px auto" }}
                    />
                    <div className="relative">
                      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5b3d86] shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-semibold leading-tight text-[#262033]">{group.title}</h2>
                      <p className="mt-4 text-sm leading-7 text-[#5d546b]">{group.description}</p>
                      <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]">
                        Ver produtos
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      </article>
    </>
  );
};

export default Produtos;
