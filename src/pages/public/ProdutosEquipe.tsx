import { useEffect, useState } from "react";
import { MessageCircle, Users } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Button, Container, Section } from "@/components/public";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, productService } from "@/services/productService";
import { siteImageUrl } from "@/styles/theme";

const WHATSAPP_BASE_URL = "https://wa.me/5511910163007";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
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

const ProdutosEquipe = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getActiveProducts();
      setProducts(data.filter((product) => product.type === "team"));
    } catch (error) {
      console.error("Error loading team products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Produtos criados pela nossa equipe"
        description="Produtos criados pela equipe da Clínica Crescer."
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Produtos", url: "/produtos" },
          { name: "Equipe", url: "/produtos/equipe" },
        ]}
      />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#fbfafc] pb-16 pt-14 md:pb-20 md:pt-20" spacing="compact">
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
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5b3d86] shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
              <Users className="h-6 w-6" />
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
              Produtos criados pela nossa equipe
            </h1>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((item) => (
                  <div key={item} className="rounded-[30px] border border-[#eee7f6] bg-white p-5 shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                    <Skeleton className="mb-5 aspect-[16/10] w-full rounded-2xl" />
                    <Skeleton className="mb-3 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-[34px] border border-[#eee7f6] bg-white p-8 text-center shadow-[0_22px_70px_rgba(62,46,89,0.1)]">
                <p className="text-muted-foreground">Nenhum produto ativo encontrado.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {products.map((product) => {
                  const gallery = getGalleryImages(product);

                  return (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-[30px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(62,46,89,0.14)]"
                    >
                      {gallery.length > 0 ? (
                        <div className="grid aspect-[16/10] grid-cols-3 gap-1 overflow-hidden bg-[#f8f2ff]">
                          <img
                            src={gallery[0]}
                            alt={product.title}
                            className="col-span-2 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                          <div className="grid gap-1">
                            {(gallery.slice(1, 3).length > 0 ? gallery.slice(1, 3) : [gallery[0], gallery[0]]).map((image, index) => (
                              <img
                                key={`${image}-${index}`}
                                src={image}
                                alt=""
                                className="h-full min-h-0 w-full object-cover"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]">
                          <img src={siteImageUrl(assets.icon)} alt="" className="h-16 w-16 object-contain opacity-80" loading="lazy" />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h2 className="text-xl font-semibold leading-snug text-[#262033]">{product.title}</h2>
                          {product.price && (
                            <span className="rounded-full bg-[#fff3c7] px-3 py-1 text-sm font-semibold text-[#795716]">
                              {product.price}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-4 text-sm leading-7 text-[#5d546b]">{product.description}</p>
                        )}
                        <Button asChild className="mt-6" size="sm">
                          <a href={buildWhatsAppUrl(product.title)} target="_blank" rel="noreferrer">
                            <MessageCircle className="h-4 w-4" />
                            Adquirir pelo WhatsApp
                          </a>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </Container>
        </Section>
      </article>
    </>
  );
};

export default ProdutosEquipe;
