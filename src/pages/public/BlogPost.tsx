import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MessageCircle, User } from "lucide-react";

import { SEOHead } from "@/components/SEOHead";
import { PublicPage } from "@/components/PublicPage";
import { Button, Container, Section } from "@/components/public";
import { Skeleton } from "@/components/ui/skeleton";
import { blogService, BlogPost } from "@/services/blogService";
import { siteImageUrl } from "@/styles/theme";

const WHATSAPP_ARTICLE_URL =
  "https://wa.me/5511910163007?text=Ol%C3%A1%2C%20li%20um%20artigo%20no%20site%20da%20Cl%C3%ADnica%20Crescer%20e%20gostaria%20de%20saber%20mais.";

const patternWhite = siteImageUrl("patterns/pattern-branco.png");
const patternPurple = siteImageUrl("patterns/pattern-roxo.png");

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      const data = await blogService.getPostBySlug(postSlug);
      setPost(data);
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicPage title="" description="">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="mb-8 h-6 w-3/4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </PublicPage>
    );
  }

  if (!post) {
    return (
      <PublicPage title="Artigo não encontrado" description="">
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">Artigo não encontrado.</p>
          <Link to="/blog" className="text-primary hover:underline">
            Voltar para o blog
          </Link>
        </div>
      </PublicPage>
    );
  }

  const seoTitle = post.seo_title || `${post.title} | Clínica Crescer`;
  const seoDescription = post.seo_description || post.excerpt;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: seoDescription,
    image: post.cover_image,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "Clínica Crescer",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${window.location.origin}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={post.title}
        ogImage={post.cover_image}
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#5b3d86] pb-16 pt-10 text-white md:pb-20 md:pt-14" spacing="compact">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{ backgroundImage: `url("${patternPurple}")`, backgroundSize: "460px auto" }}
          />
          <div aria-hidden="true" className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#ffd96f]/22 blur-3xl" />
          <Container className="relative z-10">
            <Link
              to="/blog"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/10 px-4 py-2 text-sm font-semibold text-white/86 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/16 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o blog
            </Link>

            <div className="grid gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
              <header>
                <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-white md:text-5xl lg:text-6xl">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/76">
                  {post.published_at && (
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.published_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                    <User className="h-4 w-4" />
                    <span>Clínica Crescer</span>
                  </div>
                </div>
              </header>

              {post.cover_image && (
                <div className="relative">
                  <div aria-hidden="true" className="absolute -inset-4 rounded-[42px] bg-[#ffd96f]/18 blur-2xl" />
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="relative aspect-[16/10] max-h-[430px] w-full rounded-[34px] object-cover shadow-[0_30px_90px_rgba(38,32,51,0.28)]"
                  />
                </div>
              )}
            </div>
          </Container>
        </Section>

        <Section tone="default">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(251,250,252,0.94), rgba(255,255,255,0.96)), url("${patternWhite}")`,
              backgroundSize: "cover, 420px auto",
            }}
          />
          <Container size="content" className="relative z-10">
            <div
              className="blog-content prose prose-lg max-w-none rounded-[34px] border border-[#eee7f6] bg-white p-6 shadow-[0_18px_55px_rgba(62,46,89,0.08)] sm:p-8 md:p-10"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />

            <section className="mt-10 rounded-[34px] border border-[#eee7f6] bg-white p-7 shadow-[0_18px_55px_rgba(62,46,89,0.08)] sm:p-8">
              <h3 className="mb-4 text-xl font-bold text-primary">Compartilhe este artigo</h3>
              <p className="mb-4 text-muted-foreground">
                Se este conteúdo foi útil para você, compartilhe com outras pessoas
                que também podem se beneficiar.
              </p>
            </section>

            <section
              className="mt-8 overflow-hidden rounded-[34px] bg-[#5b3d86] p-7 text-white shadow-[0_26px_80px_rgba(62,46,89,0.16)] sm:p-8"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(91,61,134,0.94), rgba(141,99,199,0.72)), url("${patternWhite}")`,
                backgroundSize: "cover, 420px auto",
              }}
            >
              <h3 className="text-2xl font-semibold">Precisa conversar com a Clínica Crescer?</h3>
              <Button asChild variant="secondary" className="mt-6" withArrow>
                <a href={WHATSAPP_ARTICLE_URL} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Falar com a equipe
                </a>
              </Button>
            </section>
          </Container>
        </Section>
      </article>
    </>
  );
};

export default BlogPost;
