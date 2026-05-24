import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, Lightbulb, Shield, Users, ArrowRight, Star } from "lucide-react";

import { PublicPage } from "@/components/PublicPage";
import { siteImageUrl } from "@/styles/theme";
import { cn } from "@/lib/utils";
import { staffService, StaffMember } from "@/services/staffService";

const Sobre = () => {
  const assets = {
    textureYellow: "backgrounds/textura-amarela.png",
    texturePurple: "backgrounds/textura-roxa.png",
    patternPurple: "patterns/pattern-roxo.png",
    patternWhite: "patterns/pattern-branco.png",
  };

  const carouselImages = [
    {
      url: siteImageUrl("ambiente-unidades/fachada-proximo-crescer.jpg"),
      alt: "Fachada da Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/recepcao-clinica-crescer.jpg"),
      alt: "Recepção da Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/vila-crescer.jpg"),
      alt: "Vila Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/ambiente-crescer.jpg"),
      alt: "Ambiente acolhedor da Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/recepcao-clinica-crescer.jpg"),
      alt: "Recepção da Clínica Crescer"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadStaff = async () => {
      try {
        const data = await staffService.getActiveStaff();
        if (mounted) setStaff(data);
      } catch (error) {
        console.error("Error loading staff:", error);
      }
    };
    loadStaff();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!autoPlay || reducedMotion || isHovering) {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoPlay, reducedMotion, isHovering, carouselImages.length]);

  const getSlideStyle = (index: number) => {
    if (reducedMotion) {
      return index === currentIndex 
        ? { opacity: 1, transform: "translateX(0)" }
        : { opacity: 0, transform: "translateX(0)" };
    }

    const totalSlides = carouselImages.length;
    const offset = (index - currentIndex + totalSlides) % totalSlides;

    if (offset === 0) {
      return {
        opacity: 1,
        transform: "translateX(0) translateZ(0) scale(1)",
        zIndex: 10
      };
    } else if (offset === 1 || offset === totalSlides - 1) {
      const direction = offset === 1 ? 1 : -1;
      return {
        opacity: 0.65,
        transform: `translateX(${direction * 170}px) translateZ(-170px) scale(0.75) rotateY(${direction * -12}deg)`,
        zIndex: 5
      };
    } else if (offset === 2 || offset === totalSlides - 2) {
      const direction = offset === 2 ? 1 : -1;
      return {
        opacity: 0.35,
        transform: `translateX(${direction * 250}px) translateZ(-260px) scale(0.62) rotateY(${direction * -16}deg)`,
        zIndex: 1
      };
    } else {
      return {
        opacity: 0,
        transform: "translateX(0) translateZ(-320px) scale(0.52)",
        zIndex: 0
      };
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    setAutoPlay(false);
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  const founder = staff.find(m => m.member_type === 'founder' || m.is_featured) || staff[0];
  const visibleTeam = staff.filter(m => m.id !== founder?.id).slice(0, 6);

  return (
    <PublicPage
      title="Sobre a Clínica Crescer"
      description="Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Sobre', url: '/sobre' }
      ]}
    >
      <article className="bg-[#fbfafc] text-[#262033]">
        {/* Hero Section */}
        <section className="relative py-24 md:py-28">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,243,199,0.34)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 760px auto",
            }}
          />

          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 relative">
            {/* Title */}
            <header className="text-center mb-14 md:mb-18">
              <h2 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Sobre a Clínica Crescer
              </h2>
              <p className="mt-6 mx-auto max-w-3xl text-lg leading-8 text-[#5d546b]">
                Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil.
              </p>
            </header>

            {/* Carousel - reduced size */}
            <div className="relative h-[256px] lg:h-[304px]">
              <div
                ref={containerRef}
                className="relative h-full w-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1500px" }}>
                  {carouselImages.map((image, index) => {
                    const isActive = index === currentIndex;
                    const style = getSlideStyle(index);

                    return (
                      <div
                        key={index}
                        className={cn(
                          "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out",
                          isActive && reducedMotion && "animate-[heroFloat_6s_ease-in-out_infinite]"
                        )}
                        style={{
                          ...style,
                          pointerEvents: isActive ? 'auto' : 'none',
                        }}
                        onClick={() => !isActive && goToSlide(index)}
                        role="button"
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Ver ${image.alt}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            goToSlide(index);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "w-[55%] max-w-[270px] rounded-[24px] overflow-hidden shadow-[0_16px 52px_rgba(62,46,89,0.12)]",
                            isActive ? "shadow-[0_20px 64px_rgba(62,46,89,0.15)]" : "shadow-[0_12px 40px_rgba(62,46,89,0.08)]"
                          )}
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className={cn(
                              "h-full w-full object-cover",
                              !isActive && "cursor-pointer"
                            )}
                            loading="eager"
                          />
                          <div
                            className={cn(
                              "pointer-events-none absolute inset-0",
                              isActive
                                ? "bg-gradient-to-tr from-[#262033]/5 via-transparent to-[#fff3c7]/4"
                                : "bg-gradient-to-br from-white/8 to-transparent"
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                {!reducedMotion && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-sm transition-all hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-sm transition-all hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        index === currentIndex
                          ? "w-4 bg-[#5b3d86]"
                          : "w-1.5 bg-white/60 hover:bg-white/80"
                      )}
                      aria-label={`Ir para imagem ${index + 1}`}
                      aria-current={index === currentIndex ? "true" : "false"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">Nossa História</p>
                <h2 className="text-3xl font-semibold leading-tight text-[#262033] sm:text-4xl">
                  Nossa História
                </h2>
                <p className="mt-6 text-base leading-8 text-[#5d546b]">
                  A Clínica Crescer nasceu do desejo de oferecer às famílias um cuidado que fosse além da sessão terapêutica. 
                  Nosso começo foi marcado pela escuta atenta aos pais que buscavam não apenas atendimento, mas compreensão, 
                  orientação e um caminho claro para o desenvolvimento de seus filhos.
                </p>
                <p className="mt-4 text-base leading-8 text-[#5d546b]">
                  Desde o início, acreditamos que a intervenção precisa fazer sentido na vida real — dentro de casa, na escola, 
                  nas relações familiares. Essa visão nos trouxe até aqui, com duas unidades em Bragança Paulista e uma equipe 
                  que cresceu sem perder a essência do cuidado próximo e personalizado.
                </p>
                <p className="mt-4 text-base leading-8 text-[#5d546b]">
                  Cada passo da nossa trajetória foi guiado pela escuta das famílias, pela atualização científica constante 
                  e pelo compromisso com resultados que se refletem no dia a dia de cada criança e adolescente que atendemos.
                </p>
              </div>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#efe2ff]/60 hidden lg:block"
                />
                <div className="relative rounded-[32px] overflow-hidden shadow-[0_22px_70px_rgba(62,46,89,0.12)]">
                  <img
                    src={siteImageUrl("ambiente-unidades/fachada-unidade-criancas-crescer.jpg")}
                    alt="Fachada da Clínica Crescer"
                    className="w-full h-[400px] object-cover"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#262033]/12 via-transparent to-[#fff3c7]/8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="py-16 md:py-24 bg-[#5b3d86] relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100"
            style={{
              backgroundImage: `url("${siteImageUrl(assets.texturePurple)}")`,
              backgroundPosition: "center top",
              backgroundRepeat: "repeat",
              backgroundSize: "760px auto",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(91,61,134,0.12),rgba(38,32,51,0.08)_52%,rgba(91,61,134,0.18))]"
          />
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd96f]">Nossa Missão</p>
              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Nossa Missão
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/82">
                Transformar intervenção especializada em evolução funcional na vida real, com participação ativa da família 
                e decisões baseadas em dados. Cada avaliação, cada sessão, cada orientação é pensada para que o cuidado não 
                fique restrito ao consultório — ele precisa fazer diferença onde a criança e o adolescente mais precisam: 
                em casa, na escola e nas relações que constroem o dia a dia.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Heart,
                  title: "Acolhimento",
                  text: "Receber cada família com escuta, respeito e empatia, criando um ambiente onde dúvidas e angústias possam ser compartilhadas com segurança."
                },
                {
                  icon: Lightbulb,
                  title: "Ciência aplicada",
                  text: "Fundamentar cada intervenção em evidências científicas, com metas claras, registros sistemáticos e decisões baseadas em dados."
                },
                {
                  icon: Users,
                  title: "Família como parceira",
                  text: "Enxergar a família como parte essencial do processo, oferecendo orientação, treino e acompanhamento para que a intervenção continue além da sessão."
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Icon className="h-5 w-5 text-[#ffd96f]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/75">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-16 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("${siteImageUrl(assets.patternWhite)}")`,
              backgroundPosition: "center top",
              backgroundRepeat: "repeat",
              backgroundSize: "420px auto",
            }}
          />
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">Nossos Valores</p>
              <h2 className="text-3xl font-semibold leading-tight text-[#262033] sm:text-4xl">
                Nossos Valores
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5d546b]">
                Princípios que orientam cada decisão clínica e cada interação com as famílias.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Ética e transparência",
                  description: "Comunicação clara com as famílias sobre processos, evolução e decisões clínicas.",
                  tone: "lilac" as const,
                },
                {
                  title: "Respeito ao tempo de cada criança",
                  description: "Reconhecer que cada desenvolvimento é único e merece um plano individualizado.",
                  tone: "warm" as const,
                },
                {
                  title: "Compromisso com resultados reais",
                  description: "Focar em habilidades que fazem diferença concreta na rotina da criança e da família.",
                  tone: "blue" as const,
                },
                {
                  title: "Atualização contínua",
                  description: "Busca constante por formação e evidências que melhorem a qualidade do atendimento.",
                  tone: "coral" as const,
                },
              ].map((value) => {
                const bgTones = {
                  lilac: "bg-[#f8f2ff] border-[#efe2ff]",
                  warm: "bg-[#fff8df] border-[#fff3c7]",
                  blue: "bg-[#f1f9ff] border-[#dff1ff]",
                  coral: "bg-[#fff4ef] border-[#ffe1d5]",
                };
                const iconTones = {
                  lilac: "text-[#8d63c7] bg-[#efe2ff]",
                  warm: "text-[#b8860b] bg-[#fff3c7]",
                  blue: "text-[#4d9fc9] bg-[#dff1ff]",
                  coral: "text-[#e8795f] bg-[#ffe1d5]",
                };
                return (
                  <div
                    key={value.title}
                    className={cn(
                      "rounded-[22px] border p-6 shadow-[0_14px_45px_rgba(62,46,89,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(62,46,89,0.12)]",
                      bgTones[value.tone]
                    )}
                  >
                    <div className={cn("mb-5 flex h-10 w-10 items-center justify-center rounded-xl", iconTones[value.tone])}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[#262033]">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5d546b]">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Equipe */}
        {staff.length > 0 && (
          <section className="py-16 md:py-24 bg-[#f8f2ff] relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`,
                backgroundPosition: "center top",
                backgroundRepeat: "repeat",
                backgroundSize: "430px auto",
              }}
            />
            <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">Equipe</p>
                  <h2 className="text-3xl font-semibold leading-tight text-[#262033] sm:text-4xl">
                    Profissionais que olham para a criança por completo
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-[#5d546b]">
                    Uma equipe ativa, integrada e preparada para acolher diferentes necessidades do desenvolvimento.
                  </p>
                </div>
                <Link
                  to="/equipe"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86] hover:text-[#8d63c7] transition shrink-0"
                >
                  Ver toda a equipe <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {founder && (
                <div className="mb-10 rounded-[28px] border border-[#eee7f6] bg-white p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)] sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="shrink-0">
                      {founder.photo_url ? (
                        <img
                          src={founder.photo_url}
                          alt={founder.name}
                          className="h-28 w-28 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#efe2ff]">
                          <span className="text-3xl font-semibold text-[#8d63c7]">{founder.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-[#ffd96f] fill-[#ffd96f]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d63c7]">Idealizadora</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-[#262033]">{founder.name}</h3>
                      {founder.role_title && (
                        <p className="mt-1 text-sm font-medium text-[#8d63c7]">{founder.role_title}</p>
                      )}
                      {founder.bio && (
                        <p className="mt-3 text-sm leading-7 text-[#5d546b] line-clamp-3">{founder.bio}</p>
                      )}
                      {founder.specialties && founder.specialties.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {founder.specialties.slice(0, 5).map((spec) => (
                            <span key={spec} className="inline-flex items-center rounded-full bg-[#efe2ff] px-3 py-1 text-xs font-semibold text-[#5b3d86]">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {visibleTeam.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleTeam.map((member, index) => (
                    <div
                      key={member.id}
                      className={cn(
                        "group overflow-hidden rounded-[22px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(62,46,89,0.12)]",
                        index === 1 && "lg:translate-y-6"
                      )}
                    >
                      {member.photo_url ? (
                        <div className="overflow-hidden">
                          <img
                            src={member.photo_url}
                            alt={`${member.name}, ${member.role_title || "profissional da Clínica Crescer"}`}
                            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center bg-[#f8f2ff]">
                          <span className="text-4xl font-semibold text-[#8d63c7]/30">{member.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[#262033]">{member.name}</h3>
                        {member.role_title && (
                          <p className="mt-1 text-sm font-medium text-[#8d63c7]">{member.role_title}</p>
                        )}
                        {member.specialties && member.specialties.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {member.specialties.slice(0, 3).map((spec) => (
                              <span key={spec} className="inline-flex items-center rounded-full bg-[#efe2ff] px-2.5 py-0.5 text-xs font-semibold text-[#5b3d86]">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Veja também */}
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8">
            <div className="rounded-[28px] bg-[#f8f2ff] border border-[#eee7f6] p-8 sm:p-10">
              <h2 className="text-2xl font-semibold text-[#262033] mb-6">Veja também</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  to="/avaliacao-neuropsicologica"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#efe2ff] text-[#8d63c7]">
                    <Heart className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Avaliação Neuropsicológica</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Entenda como funciona</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
                <Link
                  to="/terapia-aba"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff1ff] text-[#4d9fc9]">
                    <Lightbulb className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Terapia ABA</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Conheça a abordagem</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
                <Link
                  to="/como-saber-se-meu-filho-precisa-de-ajuda"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe1d5] text-[#e8795f]">
                    <Shield className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Precisa de ajuda?</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Sinais de alerta</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
                <Link
                  to="/equipe"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#efe2ff] text-[#8d63c7]">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Nossa Equipe</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Conheça os profissionais</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
                <Link
                  to="/orientacao-parental"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3c7] text-[#b8860b]">
                    <Heart className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Orientação Parental</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Apoio para famílias</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
                <Link
                  to="/blog"
                  className="group flex items-center gap-3 rounded-2xl border border-[#eee7f6] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff1ff] text-[#4d9fc9]">
                    <Lightbulb className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#262033] group-hover:text-[#5b3d86]">Blog</h3>
                    <p className="text-xs text-[#5d546b] mt-0.5">Artigos e orientações</p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-[#b0a7bd] group-hover:text-[#5b3d86] transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PublicPage>
  );
};

export default Sobre;