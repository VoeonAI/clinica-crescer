import { PublicPage } from "@/components/PublicPage";
import { useParams } from "react-router-dom";
import { blogService, BlogPost } from "@/services/blogService";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { ArticleSchema } from "@/components/Schemas";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

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
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PublicPage title="" description="">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-8" />
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
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Artigo não encontrado.</p>
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
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: seoDescription,
    image: post.cover_image,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Clínica Crescer',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blog/${post.slug}`,
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
      
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o blog
            </Link>

            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              />
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Clínica Crescer</span>
              </div>
            </div>

            <div 
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <section className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4 text-primary">Compartilhe este artigo</h3>
              <p className="text-muted-foreground mb-4">
                Se este conteúdo foi útil para você, compartilhe com outras pessoas 
                que também podem se beneficiar.
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;