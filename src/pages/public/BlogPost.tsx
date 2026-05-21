import { PublicPage } from "@/components/PublicPage";
import { useParams } from "react-router-dom";
import { blogService, BlogPost } from "@/services/blogService";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { ArticleSchema } from "@/components/Schemas";
import { Link } from "react-router-dom";

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
      const data = await blogService.getBySlug(postSlug);
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.profiles?.full_name || 'Clínica Crescer',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <PublicPage
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        
        <article className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Link>

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            {post.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {post.profiles && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Por {post.profiles.full_name}</span>
              </div>
            )}
            {post.blog_categories && (
              <span className="text-primary font-medium">
                {post.blog_categories.name}
              </span>
            )}
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <section className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4 text-primary">Compartilhe este artigo</h3>
            <p className="text-muted-foreground mb-4">
              Se este conteúdo foi útil para você, compartilhe com outras pessoas 
              que também podem se beneficiar.
            </p>
          </section>
        </article>
      </PublicPage>
    </>
  );
};

export default BlogPost;