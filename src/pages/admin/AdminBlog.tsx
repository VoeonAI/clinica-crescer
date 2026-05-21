import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogService, BlogPost } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

const AdminBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getAdminPosts();
      setPosts(data);
    } catch (error) {
      showError("Erro ao carregar posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogService.deletePost(id);
      showSuccess("Post excluído com sucesso");
      loadPosts();
    } catch (error) {
      showError("Erro ao excluir post");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await blogService.togglePublishPost(id, !currentStatus);
      showSuccess(currentStatus ? "Post despublicado" : "Post publicado");
      loadPosts();
    } catch (error) {
      showError("Erro ao alterar status");
    }
  };

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return <Badge className="bg-green-100 text-green-800">Publicado</Badge>;
    }
    return <Badge variant="secondary">Rascunho</Badge>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        <Button onClick={() => navigate("/admin/blog/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Post
        </Button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum post encontrado</p>
            <Button onClick={() => navigate("/admin/blog/novo")}>
              Criar primeiro post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {getStatusBadge(post.published)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Slug: {post.slug}</span>
                      {post.published_at && (
                        <span>
                          Publicado em:{" "}
                          {new Date(post.published_at).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 items-center">
                    {post.published && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                        title="Ver no site"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Switch
                      checked={post.published}
                      onCheckedChange={() => handleTogglePublish(post.id, post.published)}
                      title={post.published ? "Despublicar" : "Publicar"}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/blog/${post.id}/edit`)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Excluir">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirmar exclusão
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o post "{post.title}"?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;