import { PublicPage } from "@/components/PublicPage";
import { blogService, BlogPost } from "@/services/blogService";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";

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
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicPage
      title="Blog"
      description="Artigos, dicas e orientações sobre desenvolvimento infantil, neuropsicologia e terapia ABA."
      breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]}
    >
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum artigo publicado ainda.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="h-40 w-full object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-3 text-primary">
                <a href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </a>
              </h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {post.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>Clínica Crescer</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PublicPage>
  );
};

export default Blog;