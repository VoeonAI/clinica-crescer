import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService, ProductType } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showError } from "@/utils/toast";
import { ArrowLeft, Save, X } from "lucide-react";
import ImageCropUpload from "@/components/ImageCropUpload";

const AdminProdutoNovo = () => {
  const navigate = useNavigate();

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

  const isGamelabs = formData.type === "gamelabs";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        gallery_images: isGamelabs ? [] : formData.gallery_images,
        price: isGamelabs ? undefined : formData.price,
        whatsapp_message: isGamelabs ? undefined : formData.whatsapp_message,
        external_url: isGamelabs ? formData.external_url : undefined,
      };

      await productService.createProduct(productData);
      showSuccess("Produto criado com sucesso");
      navigate("/admin/produtos");
    } catch (error: any) {
      showError(error.message || "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/produtos")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Novo Produto</h1>
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
            <div className="space-y-2">
              <Label>Upload de Imagem</Label>
              <ImageCropUpload
                profile="product-cover"
                existingUrl={formData.cover_image || null}
                onUploadComplete={(url) => setFormData((prev) => ({ ...prev, cover_image: url }))}
                onUploadError={(err) => showError(err.message)}
                buttonText="Selecionar capa"
                onRemove={() => setFormData((prev) => ({ ...prev, cover_image: "" }))}
              />
            </div>
            <div>
              <Label htmlFor="cover-url">OU URL da Imagem</Label>
              <Input
                id="cover-url"
                value={formData.cover_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, cover_image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        {!isGamelabs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Galeria de Imagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Adicionar Imagens</Label>
                <ImageCropUpload
                  profile="product-gallery"
                  multiple
                  onUploadComplete={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      gallery_images: [...prev.gallery_images, url],
                    }));
                  }}
                  onUploadAllComplete={(urls) => {
                    showSuccess(`${urls.length} imagem(ns) adicionada(s) à galeria`);
                  }}
                  onUploadError={(err) => showError(err.message)}
                  buttonText="Adicionar imagens à galeria"
                />
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
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProdutoNovo;