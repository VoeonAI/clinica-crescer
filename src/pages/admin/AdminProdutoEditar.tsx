import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService, Product, ProductType } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

const AdminProdutoEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    type: "gamelabs" as ProductType,
    title: "",
    description: "",
    cover_image: "",
    gallery_images: [] as string[],
    price: "",
    external_url: "",
    whatsapp_message: "",
    is_active: true,
    display_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const isGamelabs = formData.type === "gamelabs";

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    try {
      const data = await productService.getProductById(productId);
      if (data) {
        setProduct(data);
        setFormData({
          type: data.type,
          title: data.title,
          description: data.description || "",
          cover_image: data.cover_image || "",
          gallery_images: data.gallery_images || [],
          price: data.price || "",
          external_url: data.external_url || "",
          whatsapp_message: data.whatsapp_message || "",
          is_active: data.is_active,
          display_order: data.display_order,
        });
      }
    } catch (error) {
      showError("Erro ao carregar produto");
      navigate("/admin/produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      const productData = {
        ...formData,
        gallery_images: isGamelabs ? [] : formData.gallery_images,
        price: isGamelabs ? undefined : formData.price,
        whatsapp_message: isGamelabs ? undefined : formData.whatsapp_message,
        external_url: isGamelabs ? formData.external_url : undefined,
      };

      await productService.updateProduct(id, productData);
      showSuccess("Produto atualizado com sucesso");
      navigate("/admin/produtos");
    } catch (error: any) {
      showError(error.message || "Erro ao atualizar produto");
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const imageUrl = await productService.uploadCoverImage(file);
      setFormData({ ...formData, cover_image: imageUrl });
      showSuccess("Imagem de capa enviada!");
    } catch (error: any) {
      showError(error.message || "Erro ao enviar imagem");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const fileArray = Array.from(files);
      const imageUrls = await productService.uploadGalleryImages(fileArray);
      setFormData({
        ...formData,
        gallery_images: [...formData.gallery_images, ...imageUrls],
      });
      showSuccess(`${imageUrls.length} imagem(ns) adicionada(s)`);
    } catch (error: any) {
      showError(error.message || "Erro ao enviar imagens");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery_images: formData.gallery_images.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/produtos")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Editar Produto</h1>
        </div>
        <div className="text-center py-12">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/produtos")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Produto</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ProductType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gamelabs">Gamelabs</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active" className="text-sm">
                  Produto Ativo
                </Label>
              </div>
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
                    const file = e.target.files?.[0];
                    if (file) handleCoverUpload(file);
                  }}
                  className="flex-1"
                  disabled={uploadingCover}
                />
                <Button type="button" size="sm" disabled={uploadingCover}>
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
              <div className="relative inline-block">
                <img
                  src={formData.cover_image}
                  alt="Preview da capa"
                  className="w-48 h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData({ ...formData, cover_image: "" })}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {!isGamelabs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gallery-upload">Upload de Imagens</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="gallery-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleGalleryUpload(e.target.files);
                    }}
                    className="flex-1"
                    disabled={uploadingGallery}
                  />
                  <Button type="button" size="sm" disabled={uploadingGallery}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingGallery ? "Enviando..." : "Adicionar"}
                  </Button>
                </div>
              </div>
              {formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {formData.gallery_images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Galeria ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isGamelabs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Link Externo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="external_url">URL</Label>
                <Input
                  id="external_url"
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {!isGamelabs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preço e Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Ex: R$ 150,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_message">Mensagem WhatsApp</Label>
                <Textarea
                  id="whatsapp_message"
                  value={formData.whatsapp_message}
                  onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
                  rows={3}
                  placeholder="Mensagem pré-preenchida para o WhatsApp..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/produtos")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProdutoEditar;