import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";

import { BreadcrumbSchema } from "@/components/Schemas";
import { SEOHead } from "@/components/SEOHead";
import { Badge, Container, Section } from "@/components/public";
import { Skeleton } from "@/components/ui/skeleton";
import { blogService, BlogPost } from "@/services/blogService";
import { siteImageUrl } from "@/styles/theme";

const assets = {
  patternPurple: "patterns/pattern-roxo.png",
  textureYellow: "backgrounds/textura-amarela.png",
  icon: "icons/icone.png",
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Blog"
        description="Artigos, dicas e orientações sobre desenvolvimento infantil, neuropsicologia e terapia ABA."
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]} />

      <article className="bg-[#fbfafc] text-[#262033]">
        <Section className="bg-[#5b3d86] pb-16 pt-14 text-white md:pb-20 md:pt-20" spacing="compact">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.38]"
            style={{
              backgroundImage: `url("${siteImageUrl(assets.patternPurple)}")`,
              backgroundSize: "460px auto",
            }}
          />
          <div aria-hidden="true" className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#ffd96f]/24 blur-3xl" />
          <div aria-hidden="true" className="absolute left-12 top-20 hidden h-64 w-64 rounded-full bg-[#dff1ff]/16 blur-3xl md:block" />
          <Container className="relative z-10">
            <Badge tone="warm" className="mb-5">
              Conteúdos para famílias
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.06] text-white md:text-5xl lg:text-6xl">
              Blog
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
              Artigos, dicas e orientações sobre desenvolvimento infantil, neuropsicologia e terapia ABA.
            </p>
          </Container>
        </Section>

        <Section tone="default">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(251,250,252,0.92), rgba(255,255,255,0.96)), url("${siteImageUrl(assets.textureYellow)}")`,
              backgroundSize: "cover, 780px auto",
              backgroundPosition: "center top",
            }}
          />
          <Container className="relative z-10">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-[28px] border border-[#eee7f6] bg-white p-5 shadow-[0_14px_45px_rgba(62,46,89,0.08)]">
                    <Skeleton className="mb-5 h-48 w-full rounded-2xl" />
                    <Skeleton className="mb-3 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-5 h-4 w-5/6" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-[34px] border border-[#eee7f6] bg-white p-8 text-center shadow-[0_22px_70px_rgba(62,46,89,0.1)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efe2ff] text-[#5b3d86]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-[30px] border border-[#eee7f6] bg-white shadow-[0_14px_45px_rgba(62,46,89,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(62,46,89,0.14)]"
                  >
                    {post.cover_image ? (
                      <Link to={`/blog/${post.slug}`} aria-label={`Ler artigo ${post.title}`} className="block overflow-hidden">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      </Link>
                    ) : (
                      <Link
                        to={`/blog/${post.slug}`}
                        aria-label={`Ler artigo ${post.title}`}
                        className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#f8f2ff] via-white to-[#fff3c7]"
                      >
                        <img src={siteImageUrl(assets.icon)} alt="" className="h-16 w-16 object-contain opacity-80" loading="lazy" />
                      </Link>
                    )}

                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#7a7187]">
                        {post.published_at && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(post.published_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>Clínica Crescer</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-semibold leading-snug text-[#262033]">
                        <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-[#5b3d86]">
                          {post.title}
                        </Link>
                      </h2>

                      {post.excerpt && (
                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5d546b]">
                          {post.excerpt}
                        </p>
                      )}

                      <Link
                        to={`/blog/${post.slug}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#5b3d86]"
                      >
                        Ler artigo
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
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

export default Blog;
