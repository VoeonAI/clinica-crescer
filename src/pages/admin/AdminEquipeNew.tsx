import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { staffService } from "@/services/staffService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError } from "@/utils/toast";
import { ArrowLeft, Save } from "lucide-react";

const AdminEquipeNew = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: "",
    role_title: "",
    bio: "",
    photo_url: "",
    specialties: "",
    display_order: 0,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadMember(id);
    }
  }, [id, isEditing]);

  const loadMember = async (memberId: string) => {
    try {
      const data = await staffService.getStaffById(memberId);
      setFormData({
        name: data.name,
        role_title: data.role_title || "",
        bio: data.bio || "",
        photo_url: data.photo_url || "",
        specialties: data.specialties?.join(", ") || "",
        display_order: data.display_order,
        is_active: data.is_active,
      });
    } catch (error) {
      showError("Erro ao carregar membro");
      navigate("/admin/equipe");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const specialtiesArray = formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const memberData = {
        ...formData,
        specialties: specialtiesArray,
      };

      if (isEditing && id) {
        await staffService.updateStaffMember(id, memberData);
        showSuccess("Membro atualizado com sucesso");
      } else {
        await staffService.createStaffMember(memberData);
        showSuccess("Membro criado com sucesso");
      }
      navigate("/admin/equipe");
    } catch (error) {
      showError("Erro ao salvar membro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/equipe")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Editar Membro" : "Novo Membro"}
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
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role_title">Cargo/Título *</Label>
                <Input
                  id="role_title"
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  placeholder="Ex: Neuropsicóloga"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...<div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="Separe por vírgula: TEA, TDAH, Neuropsicologia"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="photo">URL da Foto</Label>
                <Input
                  id="photo"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
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
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="active" className="text-sm">
                Membro Ativo
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/equipe")}>
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

export default AdminEquipeNew;