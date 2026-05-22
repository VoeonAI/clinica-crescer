import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { blogService, BlogPost } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError } from "@/utils/toast";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BlockEditor from "@/components/BlockEditor";

const AdminBlogNew = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    published: false,
    seo_title: "",
    seo_description: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadPost(id);
    }
  }, [id, isEditing]);

  const loadPost = async (postId: string) => {
    try {
      const data = await blogService.getPostById(postId);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content || "",
        cover_image: data.cover_image || "",
        published: data.published,
        seo_title: data.seo_title || "",
        seo_description: data.seo_description || "",
      });
    } catch (error) {
      showError("Erro ao carregar post");
      navigate("/admin/blog");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (isEditing && id) {
        await blogService.updatePost(id, postData);
        showSuccess("Post atualizado com sucesso");
      } else {
        await blogService.createPost(postData);
        showSuccess("Post criado com sucesso");
      }
      navigate("/admin/blog");
    } catch (error) {
      showError("Erro ao salvar post");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: isEditing ? formData.slug : generateSlug(value),
    });
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const imageUrl = await blogService.uploadCoverImage(file);
      setFormData({ ...formData, cover_image: imageUrl });
      showSuccess("Imagem de capa enviada com sucesso!");
    } catch (error: any) {
      showError(error.message || "Erro ao enviar imagem de capa");
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Editar Post" : "Novo Post"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Resumo</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 h-10">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published" className="text-sm">
                {formData.published ? "Publicado" : "Rascunho"}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Imagem de Capa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cover-upload">Upload de Imagem</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0];
                    if (file) {
                      handleCoverUpload(file);
                    }
                  }}
                  className="flex-1"
                  disabled={uploadingCover}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={uploadingCover}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("cover-upload")?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingCover ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="cover-url">OU URL da Imagem</Label>
              <Input
                id="cover-url"
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            {formData.cover_image && (
              <div className="relative">
                <img
                  src={formData.cover_image}
                  alt="Preview da capa"
                  className="w-full max-h-64 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({ ...formData, cover_image: "" });
                  }}
                >
                  Remover
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BlockEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Comece a adicionar blocos de conteúdo..."
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo_title">Título SEO</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Opcional - usa o título do post se vazio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo_description">Descrição SEO</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                rows={3}
                placeholder="Descrição para motores de busca"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/blog")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogNew;