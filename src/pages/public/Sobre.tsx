import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PublicPage } from "@/components/PublicPage";
import { siteImageUrl } from "@/styles/theme";
import { cn } from "@/lib/utils";

const Sobre = () => {
  const assets = {
    textureYellow: "backgrounds/textura-amarela.png",
  };

  const carouselImages = [
    {
      url: siteImageUrl("ambiente-unidades/crianca-vila-crescer.png"),
      alt: "Criança brincando na Vila Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/terapia-aba-crescer.png"),
      alt: "Sessão de Terapia ABA na Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/familia-crescer.png"),
      alt: "Família na Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/fachada-unidade-criancas-crescer.jpg"),
      alt: "Fachada da unidade crianças da Clínica Crescer"
    },
    {
      url: siteImageUrl("ambiente-unidades/vila-crescer.jpg"),
      alt: "Vila Crescer"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReducedMotion);
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
        transform: `translateX(${direction * 280}px) translateZ(-280px) scale(0.82) rotateY(${direction * -18}deg)`,
        zIndex: 5
      };
    } else if (offset === 2 || offset === totalSlides - 2) {
      const direction = offset === 2 ? 1 : -1;
      return {
        opacity: 0.35,
        transform: `translateX(${direction * 400}px) translateZ(-420px) scale(0.72) rotateY(${direction * -24}deg)`,
        zIndex: 1
      };
    } else {
      return {
        opacity: 0,
        transform: "translateX(0) translateZ(-520px) scale(0.62)",
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

  const handleTouchMove = (e: React.TouchEvent) => {
    // Just tracking, no action needed
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

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
        <section className="relative py-16 md:py-24">
          {/* Background with yellow texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,243,199,0.34)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 760px auto",
              opacity: 0.26,
              mixBlendMode: "multiply"
            }}
          />
          
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 lg:px-8 relative grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: Text */}
            <header className="flex flex-col justify-center order-2 lg:order-1">
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Sobre a Clínica Crescer
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil.
              </p>
            </header>

            {/* Right: 3D Carousel */}
            <div className="relative h-[400px] lg:h-[480px] order-1 lg:order-2">
              <div
                ref={containerRef}
                className="relative h-full w-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
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
                            "w-[85%] max-w-[440px] rounded-[32px] overflow-hidden shadow-[0_32px 90px_rgba(62,46,89,0.18)]",
                            isActive ? "shadow-[0_42px 110px_rgba(62,46,89,0.24)]" : "shadow-[0_24px 70px_rgba(62,46,89,0.14)]"
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
                                ? "bg-gradient-to-tr from-[#262033]/8 via-transparent to-[#fff3c7]/6" 
                                : "bg-gradient-to-br from-white/12 to-transparent"
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-5 w-5" />
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
                        "h-2 rounded-full transition-all duration-300",
                        index === currentIndex
                          ? "w-6 bg-[#5b3d86]"
                          : "w-2 bg-white/60 hover:bg-white/80"
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

        {/* Rest of the page sections would go here */}
      </article>
    </PublicPage>
  );
};

export default Sobre;