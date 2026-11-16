import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShoppingCart } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Button, Container, Section } from "@/components/public";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, productService } from "@/services/productService";
import { siteImageUrl } from "@/styles/theme";

const WHATSAPP_BASE_URL = "https://wa.me/5511910163007";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
  patternWhite: "patterns/pattern-branco.png",
  icon: "icons/icone.png",
};

const buildWhatsAppUrl = (title: string) =>
  `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(`Olá, tenho interesse no produto: ${title}`)}`;

const getGalleryImages = (product: Product) => {
  const images = product.gallery_images?.filter(Boolean) || [];
  if (product.cover_image && !images.includes(product.cover_image)) {
    return [product.cover_image, ...images];
  }
  return images;
};

const ProdutoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await productService.getProductById(productId);
      if (!data || data.type !== "team") {
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Produto | Clínica Crescer" description="" />
        <article className="bg-[#fbfafc] text-[#262033]">
          <Section className="bg-[#fbfafc] pb-16 pt-14 md:pb-20 md:pt-20" spacing="compact">
            <Container className="relative z-10">
              <Skeleton className="mb-6 h-5 w-40" />
              <Skeleton className="mb-4 h-12 w-full max-w-2xl" />
              <Skeleton className="mb-8 h-6 w-full max-w-xl" />
            </Container>
          </Section>
          <Section tone="default">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2">
                <Skeleton className="aspect-[16/10] w-full rounded-[30px]" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-12 w-48 mt-4 rounded-full" />
                </div>
              </div>
            </Container>
          </Section>
        </article>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SEOHead title="Produto não encontrado | Clínica Crescer" description="" />
        <article className="bg-[#fbfafc] text-[#262033]">
          <Section tone="default">
            <Container size="content" className="text-center">
              <p className="mb-4 text-lg text-[#5d546b]">Produto não encontrado.</p>
              <Link
                to="/produtos/equipe"
                className="inline-flex items-center gap-2 rounded-full bg-[#5b3d86] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d3175]"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para produtos
              </Link>
            </Container>
          </Section>
        </article>
      </>
    );
  }

  const gallery = getGalleryImages(product);
  const hasPurchase = product.purchase_url_enabled && product.purchase_url;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.cover_image || undefined,
  };

  return (
    <>
      <SEOHead
        title={`${product.title} | Clínica Crescer`}
        description={product.description || `Detalhes do produto: ${product.title}`}
        ogImage={product.cover_image || undefined}
        ogType="website"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Produtos", url: "/produtos" },
          { name: "Equipe", url: "/produtos/equipe" },
          { name: product.title, url: `/produtos/equipe/${product.id}` },
        ]}
      />

      <article className="bg-[#fbfafc] text-[#262033]">
        {/* Hero */}
        <Section className="bg-[#fbfafc] pb-10 pt-8 md:pb-14 md:pt-12" spacing="compact">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.28] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.68), rgba(255,243,199,0.28)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundPosition: "center, center top",
              backgroundRepeat: "no-repeat, repeat-x",
              backgroundSize: "cover, 780px auto",
            }}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#fbfafc]/72 to-[#fbfafc]" />
          <Container className="relative z-10">
            <Link
              to="/produtos/equipe"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#eee7f6] bg-white px-4 py-2 text-sm font-semibold text-[#5b3d86] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f6f1fc]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para produtos
            </Link>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
              {product.title}
            </h1>
            {product.price && (
              <span className="mt-4 inline-block rounded-full bg-[#fff3c7] px-4 py-1.5 text-lg font-semibold text-[#795716]">
                {product.price}
              </span>
            )}
          </Container>
        </Section>

        {/* Conteúdo principal */}
        <Section tone="default">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              {/* Galeria */}
              <div>
                {gallery.length > 0 ? (
                  <>
                    <div className="overflow-hidden rounded-[30px] border border-[#eee7f6] bg-white shadow-[0_18px_55px_rgba(62,46,89,0.1)]">
                      <img
                        src={gallery[activeImage] || gallery[0]}
                        alt={product.title}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                    {gallery.length > 1 && (
                      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                        {gallery.map((image, index) => (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setActiveImage(index)}
                            className={`overflow-hidden rounded-xl border-2 transition-all ${
                              activeImage === index
                                ? "border-[#5b3d86] ring-2 ring-[#5b3d86]/20"
                                : "border-[#eee7f6] hover:border-[#c7a5f2]"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${product.title} — imagem ${index + 1}`}
                              className="aspect-square w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center rounded-[30px] border border-[#eee7f6] bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]">
                    <img src={siteImageUrl(assets.icon)} alt="" className="h-20 w-20 object-contain opacity-80" />
                  </div>
                )}
              </div>

              {/* Detalhes */}
              <div className="flex flex-col">
                <div
                  className="rounded-[30px] border border-[#eee7f6] bg-white p-7 shadow-[0_18px_55px_rgba(62,46,89,0.08)] sm:p-8"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.98)), url("${siteImageUrl(assets.patternWhite)}")`,
                    backgroundSize: "cover, 420px auto",
                  }}
                >
                  <h2 className="text-xl font-semibold text-[#262033]">Sobre este produto</h2>
                  {product.description ? (
                    <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#5d546b]">
                      {product.description}
                    </p>
                  ) : (
                    <p className="mt-4 text-[15px] leading-8 text-[#b0a7bd]">
                      Sem descrição disponível.
                    </p>
                  )}

                  {product.price && (
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-sm font-medium text-[#8b8198]">Preço:</span>
                      <span className="text-2xl font-bold text-[#5b3d86]">{product.price}</span>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-col gap-3">
                  {hasPurchase && (
                    <Button asChild size="lg" className="w-full">
                      <a href={product.purchase_url!} target="_blank" rel="noreferrer">
                        <ShoppingCart className="h-5 w-5" />
                        Adquira agora
                      </a>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant={hasPurchase ? "secondary" : "primary"}
                    size="lg"
                    className="w-full"
                  >
                    <a href={buildWhatsAppUrl(product.title)} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-5 w-5" />
                      {hasPurchase ? "Tirar dúvidas pelo WhatsApp" : "Adquirir pelo WhatsApp"}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA final */}
        <Section tone="default" spacing="compact">
          <Container>
            <div
              className="overflow-hidden rounded-[34px] bg-[#5b3d86] p-8 text-white shadow-[0_26px_80px_rgba(62,46,89,0.16)] sm:p-10"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.94), rgba(141,99,199,0.72)), url("${siteImageUrl(assets.patternWhite)}")`,
                backgroundSize: "cover, 420px auto",
              }}
            >
              <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">
                Fale com a nossa equipe
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">
                Tem alguma dúvida sobre este produto ou quer saber mais sobre como ele pode ajudar?
                Estamos aqui para conversar com você.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="secondary" size="md">
                  <a href={buildWhatsAppUrl(product.title)} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </a>
                </Button>
                <Link
                  to="/produtos/equipe"
                  className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white/86 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/16"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Ver outros produtos
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </article>
    </>
  );
};

export default ProdutoDetalhe;