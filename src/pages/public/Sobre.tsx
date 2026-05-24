<article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-16 pt-16 md:pb-24 md:pt-20 overflow-visible -mt-2 md:-mt-4" spacing="compact">
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
          <Container className="relative grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <header className="flex flex-col justify-center">
              <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
                Sobre a Clínica Crescer
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5d546b]">
                Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil.
              </p>
            </header>

            <div className="relative min-h-[400px] lg:min-h-[480px] mt-6 lg:mt-8">
              <div
                ref={containerRef}
                className="relative h-full w-full"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="absolute inset-0 flex items-center justify-center perspective-[1500px]">
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
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2 md:-left-4"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#5b3d86] shadow-lg transition-all hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8d63c7] focus:ring-offset-2 md:-right-4"
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
          </Container>
        </Section>
</article>