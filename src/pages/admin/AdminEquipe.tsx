import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffService, StaffMember } from "@/services/staffService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Star, User, Briefcase } from "lucide-react";
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

const AdminEquipe = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffService.getAdminStaff();
      setStaff(data);
    } catch (error) {
      showError("Erro ao carregar equipe");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (member: StaffMember) => {
    try {
      await staffService.updateStaffMember(member.id, { is_active: !member.is_active });
      showSuccess(member.is_active ? "Membro desativado" : "Membro ativado");
      loadStaff();
    } catch (error) {
      showError("Erro ao alterar status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await staffService.deleteStaffMember(id);
      showSuccess("Membro excluído com sucesso");
      loadStaff();
    } catch (error) {
      showError("Erro ao excluir membro");
    }
  };

  const getMemberTypeBadge = (type: string, featured: boolean) => {
    const colors = {
      founder: "bg-purple-100 text-purple-800",
      therapist: "bg-blue-100 text-blue-800",
      staff: "bg-gray-100 text-gray-800",
    };

    const labels = {
      founder: "Idealizadora",
      therapist: "Terapeuta",
      staff: "Funcionário",
    };

    return (
      <div className="flex items-center gap-2">
        {featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
        <Badge className={colors[type as keyof typeof colors]}>
          {labels[type as keyof typeof labels]}
        </Badge>
      </div>
    );
  };

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case 'founder':
        return <Star className="w-5 h-5 text-purple-600" />;
      case 'therapist':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'staff':
        return <Briefcase className="w-5 h-5 text-gray-600" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Equipe</h1>
        <Button onClick={() => navigate("/admin/equipe/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      {loading ? (
        <div>Carregando...</div>
      ) : staff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum membro encontrado</p>
            <Button onClick={() => navigate("/admin/equipe/novo")}>
              Adicionar primeiro membro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member) => (
            <Card key={member.id} className={member.is_active ? "" : "opacity-60"}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                    {getMemberTypeIcon(member.member_type)}
                    {getMemberTypeBadge(member.member_type, member.is_featured)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-4">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-muted mb-3 flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role_title}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {member.bio}
                </p>
                {member.specialties && member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.specialties.map((spec, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(member)}
                    title={member.is_active ? "Desativar" : "Ativar"}
                  >
                    {member.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/admin/equipe/${member.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{member.name}"? Esta ação não pode
                          ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(member.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEquipe;