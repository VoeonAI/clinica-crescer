import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HeartHandshake, Sparkles, Users } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Badge, Container, Section } from "@/components/public";
import { cn } from "@/lib/utils";
import { staffService, StaffMember } from "@/services/staffService";
import { siteImageUrl } from "@/styles/theme";

const pageTitle = "Sobre a Clínica Crescer";
const pageDescription =
  "Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil.";

const assets = {
  patternPurple: "patterns/pattern-roxo.png",
  patternWhite: "patterns/pattern-branco.png",
  textureYellow: "backgrounds/textura-amarela.png",
  icon: "icons/icone.png",
  about: "ambiente-unidades/crianca-vila-crescer.png",
  facade: "ambiente-unidades/fachada-unidade-criancas-crescer.jpg",
  animatedSvg: "svg-animado/crescer-logoforma-animada-carregando.svg",
};

const heroImages = {
  fachada: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/ambiente-unidades/fachada-proximo-crescer.jpg",
  recepcao: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/ambiente-unidades/recepcao-clinica-crescer.jpg",
  vila: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/ambiente-unidades/vila-crescer.jpg",
};

const values = [
  "Acolhimento e respeito à diversidade",
  "Ética profissional e responsabilidade",
  "Atualização científica constante",
  "Trabalho em equipe multidisciplinar",
  "Foco na família como parceira do tratamento",
];

const relatedLinks = [
  { label: "Avaliação Neuropsicológica", href: "/avaliacao-neuropsicologica" },
  { label: "Terapia ABA", href: "/terapia-aba" },
  { label: "Blog - Artigos e Orientações", href: "/blog" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const StaffPhoto = ({ member, featured = false }: { member: StaffMember; featured?: boolean }) => {
  const [failed, setFailed] = useState(false);
  const hasPhoto = member.photo_url && !failed;

  if (!hasPhoto) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-[#efe2ff] via-white to-[#fff3c7] font-semibold text-[#5b3d86] shadow-[0_18px 55px_rgba(62,46,89,0.1)]",
          featured ? "h-40 w-40 text-4xl sm:h-48 sm:w-48" : "h-28 w-28 text-2xl",
        )}
        aria-label={member.name}
        role="img"
      >
        {getInitials(member.name)}
      </div>
    );
  }

  return (
    <img
      src={member.photo_url || ""}
      alt={`${member.name}, ${member.role_title || "profissional da Clínica Crescer"}`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "rounded-full object-cover shadow-[0_18px 55px_rgba(62,46,89,0.12)] ring-4 ring-white",
        featured ? "h-40 w-40 sm:h-48 sm:w-48" : "h-28 w-28",
      )}
    />
  );
};

const PageImage = ({
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
          "flex min-h-[280px] items-center justify-center bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]",
          className,
        )}
      >
        <img src={siteImageUrl(assets.icon)} alt="" className="h-20 w-20 object-contain opacity-80" loading="lazy" />
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

const Sobre = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadStaff = async () => {
      try {
        const data = await staffService.getActiveStaff();
        if (mounted) setStaff(data);
      } catch (error) {
        console.error("Error loading staff on about page:", error);
      }
    };

    loadStaff();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredMember = useMemo(
    () =>
      staff.find((member) => member.is_featured) ||
      staff.find((member) => member.member_type === "founder") ||
      staff[0],
    [staff],
  );

  const otherMembers = useMemo(
    () => staff.filter((member) => member.id !== featuredMember?.id),
    [featuredMember?.id, staff],
  );

  return (
    <>
      <SEOHead title={pageTitle} description={pageDescription} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Sobre", url: "/sobre" }]} />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-16 pt-14 md:pb-24 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.26] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,243,199,0.34)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 760px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 top-12 h-72 w-72 rounded-full bg-[#ffd96f]/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute left-8 top-24 hidden h-64 w-64 rounded-full bg-[#dff1ff]/60 blur-3xl md:block"
          />
          <Container className="relative grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <header>
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Sobre a Clínica Crescer
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil.
              </p>
            </header>

            <div className="relative min-h-[480px]">
              <div
                className="relative h-[480px] w-full"
              >
                {/* Vila Crescer - Main Image - Center */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[75%] max-w-[420px] rounded-[36px] overflow-hidden shadow-[0_32px_90px_rgba(62,46,89,0.16)] animate-[heroFloat_6s_ease-in-out_infinite]"
                >
                  <img
                    src={heroImages.vila}
                    alt="Vila Crescer - ambiente acolhedor"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#262033]/8 via-transparent to-[#fff3c7]/6" />
                </div>

                {/* Recepção - Overlapping - Left, slightly rotated */}
                <div
                  className="absolute left-[8%] top-[15%] z-20 w-[55%] max-w-[280px] rounded-[28px] overflow-hidden shadow-[0_24px 70px_rgba(62,46,89,0.14)] animate-[heroFloat_7s_ease-in-out_1s_infinite]"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  <img
                    src={heroImages.recepcao}
                    alt="Recepção da Clínica Crescer"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 to-transparent" />
                </div>

                {/* Fachada - Overlapping - Right, slightly rotated */}
                <div
                  className="absolute right-[5%] bottom-[10%] z-20 w-[58%] max-w-[300px] rounded-[30px] overflow-hidden shadow-[0_28px 80px_rgba(62,46,89,0.15)] animate-[heroFloat_8s_ease-in-out_0.5s_infinite]"
                  style={{ transform: "rotate(3deg)" }}
                >
                  <img
                    src={heroImages.fachada}
                    alt="Fachada da Clínica Crescer"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-white/10 to-transparent" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section tone="default" className="overflow-visible">
          <Container className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <section className="relative rounded-[36px] border border-[#eee7f6] bg-white p-7 shadow-[0_22px 70px_rgba(62,46,89,0.1)] transition-all duration-300 hover:-translate-y-1 sm:p-9">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#fff3c7]" />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efe2ff] text-[#5b3d86]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-primary">Nossa História</h2>
                <p className="text-muted-foreground">
                  A Clínica Crescer nasceu do desejo de oferecer um atendimento humanizado
                  e especializado para crianças e famílias que enfrentam desafios no
                  desenvolvimento. Desde nossa fundação, buscamos integrar evidências
                  científicas com acolhimento e respeito às individualidades de cada paciente.
                </p>
              </div>
            </section>

            <section
              className="relative overflow-hidden rounded-[36px] bg-[#5b3d86] p-7 text-white shadow-[0_26px 80px_rgba(62,46,89,0.16)] transition-all duration-300 hover:-translate-y-1 sm:p-9"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.94), rgba(77,159,201,0.72)), url("${siteImageUrl(assets.patternWhite)}")`,
                backgroundSize: "cover, 380px auto",
              }}
            >
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 text-white">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Nossa Missão</h2>
                <p className="mb-4 text-white/84">
                  Promover o desenvolvimento saudável de crianças e adolescentes através de
                  atendimento especializado, integrado e baseado em evidências científicas,
                  sempre com foco no bem-estar da família como um todo.
                </p>
              </div>
            </section>
          </Container>
        </Section>

        <Section tone="lilac">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{ backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`, backgroundSize: "440px auto" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#f8f2ff]/92"
          />
          <Container className="relative z-10">
            <section>
              <h2 className="mb-8 text-2xl font-bold text-primary">Nossos Valores</h2>
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {values.map((value, index) => (
                  <li
                    key={value}
                    className={cn(
                      "group rounded-[26px] border p-5 shadow-[0_18px 55px_rgba(62,46,89,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px 80px_rgba(62,46,89,0.18)]",
                      index === 0 && "border-[#dec7ff] bg-[#efe2ff] text-[#2d2050]",
                      index === 1 && "border-[#ffdec7] bg-[#fff4ef] text-[#4a2420]",
                      index === 2 && "border-[#ffe8a8] bg-[#fff8df] text-[#3a3010]",
                      index === 3 && "border-[#b8e0f4] bg-[#dff1ff] text-[#1a2d3d]",
                      index === 4 && "border-[#b8e8d0] bg-[#f3faf6] text-[#1d362a]",
                    )}
                  >
                    <CheckCircle2 className="mb-5 h-5 w-5 text-[#8d63c7] transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm font-semibold leading-6">{value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            <section>
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary">Equipe</h2>
                  <p className="mt-4 text-muted-foreground">
                    Conheça nossos profissionais especializados.
                  </p>
                </div>
                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#dff1ff] text-[#5b3d86] md:flex">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {featuredMember && (
                <div className="mb-6 rounded-[36px] border border-[#eee7f6] bg-white p-6 shadow-[0_22px 70px_rgba(62,46,89,0.1)] sm:p-8">
                  <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                    <StaffPhoto member={featuredMember} featured />
                    <div>
                      <h3 className="text-2xl font-semibold text-[#262033]">{featuredMember.name}</h3>
                      {featuredMember.role_title && (
                        <p className="mt-2 text-sm font-semibold text-[#8d63c7]">{featuredMember.role_title}</p>
                      )}
                      {featuredMember.specialties && featuredMember.specialties.length > 0 && (
                        <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                          {featuredMember.specialties.slice(0, 4).map((specialty) => (
                            <Badge key={specialty} tone="blue">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {otherMembers.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {otherMembers.map((member) => (
                    <article
                      key={member.id}
                      className="group rounded-[30px] border border-[#eee7f6] bg-white p-6 text-center shadow-[0_14px 45px rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px 70px rgba(62,46,89,0.12)]"
                    >
                      <div className="flex justify-center">
                        <StaffPhoto member={member} />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-[#262033]">{member.name}</h3>
                      {member.role_title && (
                        <p className="mt-2 text-sm text-muted-foreground">{member.role_title}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </Container>
        </Section>

        <Section tone="lilac" spacing="compact">
          <Container size="content">
            <section
              className="relative overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_22px 70px_rgba(62,46,89,0.12)] sm:p-8"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,242,255,0.82)), url("${siteImageUrl(assets.patternPurple)}")`,
                backgroundSize: "cover, 420px auto",
              }}
            >
              <h3 className="mb-4 font-semibold text-[#262033]">Veja também</h3>
              <ul className="grid gap-3 text-sm sm:grid-cols-3">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-[#eee7f6] bg-white/82 px-4 py-3 font-semibold text-[#5b3d86] shadow-[0_10px 30px rgba(62,46,89,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#dec7ff] hover:bg-[#f8f2ff]"
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

export default Sobre;