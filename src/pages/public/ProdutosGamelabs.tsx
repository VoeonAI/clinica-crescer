import { useEffect, useState } from "react";
import { ExternalLink, FlaskConical } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Button, Container, Section } from "@/components/public";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, productService } from "@/services/productService";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  textureYellow: "backgrounds/textura-amarela.png",
  patternPurple: "patterns/pattern-roxo.png",
  icon: "icons/icone.png",
};

const ProdutosGamelabs = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getActiveProducts();
      setProducts(data.filter((product) => product.type === "gamelabs"));
    } catch (error) {
      console.error("Error loading gamelabs products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Produtos desenvolvidos no Gamelabs"
        description="Produtos desenvolvidos no Gamelabs da Clínica Crescer."
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Produtos", url: "/produtos" },
          { name: "Gamelabs", url: "/produtos/gamelabs" },
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
              <FlaskConical className="h-6 w-6" />
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-[#262033] md:text-5xl lg:text-6xl">
              Produtos desenvolvidos no Gamelabs
            </h1>
          </Container>
        </Section>

        <Section tone="default">
          <Container>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-[30px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(62,46,89,0.14)]"
                  >
                    {product.cover_image ? (
                      <img
                        src={product.cover_image}
                        alt={product.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]">
                        <img src={siteImageUrl(assets.icon)} alt="" className="h-16 w-16 object-contain opacity-80" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold leading-snug text-[#262033]">{product.title}</h2>
                      {product.description && (
                        <p className="mt-4 text-sm leading-7 text-[#5d546b]">{product.description}</p>
                      )}
                      {product.external_url && (
                        <Button asChild className="mt-6" size="sm">
                          <a href={product.external_url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Acessar
                          </a>
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Container>
        </Section>
      </article>
    </>
  );
};

export default ProdutosGamelabs;
