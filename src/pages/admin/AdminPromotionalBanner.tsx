import { FormEvent, useEffect, useState } from "react";
import { Eye, Image, Link2, Megaphone, Save, Type, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  promotionalBannerService,
  PromotionalBannerType,
} from "@/services/promotionalBannerService";
import { siteImageUrl } from "@/styles/theme";
import { showError, showSuccess } from "@/utils/toast";

const initialForm = {
  is_active: false,
  type: "text" as PromotionalBannerType,
  image_url: "",
  text: "",
  link_url: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const AdminPromotionalBanner = () => {
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      const data = await promotionalBannerService.getAdminBanner();
      if (data) {
        setBannerId(data.id);
        setFormData({
          is_active: data.is_active,
          type: data.type,
          image_url: data.image_url || "",
          text: data.text || "",
          link_url: data.link_url || "",
        });
      }
    } catch (error) {
      showError(getErrorMessage(error, "Erro ao carregar faixa promocional."));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await promotionalBannerService.uploadBannerImage(file);
      setFormData((current) => ({ ...current, image_url: imageUrl, type: "image" }));
      showSuccess("Imagem enviada com sucesso.");
    } catch (error) {
      showError(getErrorMessage(error, "Erro ao enviar imagem."));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = formData.text.trim();
    const imageUrl = formData.image_url.trim();
    const linkUrl = formData.link_url.trim();

    if (formData.is_active && formData.type === "text" && !text) {
      showError("Informe o texto da faixa antes de ativar.");
      return;
    }

    if (formData.is_active && formData.type === "image" && !imageUrl) {
      showError("Envie ou informe a URL da imagem antes de ativar.");
      return;
    }

    setSaving(true);
    try {
      const savedBanner = await promotionalBannerService.saveBanner(bannerId, {
        is_active: formData.is_active,
        type: formData.type,
        image_url: imageUrl || null,
        text: text || null,
        link_url: linkUrl || null,
      });

      setBannerId(savedBanner.id);
      showSuccess("Faixa promocional salva com sucesso.");
    } catch (error) {
      showError(getErrorMessage(error, "Erro ao salvar faixa promocional."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Faixa Promocional</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Controle o destaque dinâmico exibido entre a Hero e a próxima seção da Home.
          </p>
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Megaphone className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="banner-active" className="font-semibold">
                    Ativo
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Exibe ou oculta a faixa no topo da Home.
                  </p>
                </div>
                <Switch
                  id="banner-active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: PromotionalBannerType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="banner-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">
                      <span className="inline-flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Imagem
                      </span>
                    </SelectItem>
                    <SelectItem value="text">
                      <span className="inline-flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Texto
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-link">Link</Label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="banner-link"
                    value={formData.link_url}
                    onChange={(event) => setFormData({ ...formData, link_url: event.target.value })}
                    placeholder="https://..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {formData.type === "image" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="banner-upload">Upload imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                      />
                      <Button type="button" disabled={uploading} onClick={() => document.getElementById("banner-upload")?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? "Enviando..." : "Enviar"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="banner-image-url">URL da imagem</Label>
                    <Input
                      id="banner-image-url"
                      value={formData.image_url}
                      onChange={(event) => setFormData({ ...formData, image_url: event.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="banner-text">Texto</Label>
                  <Textarea
                    id="banner-text"
                    value={formData.text}
                    onChange={(event) => setFormData({ ...formData, text: event.target.value })}
                    rows={4}
                    placeholder="Ex: Evento especial da Clínica Crescer"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="overflow-hidden rounded-2xl border bg-[#5b3d86] shadow-sm"
              style={{
                backgroundImage:
                  formData.type === "text"
                    ? `linear-gradient(90deg, rgba(91,61,134,0.92), rgba(141,99,199,0.86)), url("${siteImageUrl("patterns/pattern-roxo.png")}")`
                    : undefined,
                backgroundSize: "cover, 420px auto",
              }}
            >
              {formData.type === "image" && formData.image_url ? (
                <img src={formData.image_url} alt="Preview da faixa promocional" className="h-28 w-full object-cover" />
              ) : (
                <div className="flex h-28 items-center justify-center px-5 text-center text-2xl font-semibold text-white">
                  {formData.text || "Texto da faixa promocional"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving || uploading}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Salvando..." : "Salvar faixa"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminPromotionalBanner;
