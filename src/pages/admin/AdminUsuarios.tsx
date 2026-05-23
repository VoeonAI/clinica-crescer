import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { profileService, Profile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, Shield, Trash2, AlertCircle, Edit } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { PermissionGate } from "@/components/PermissionGate";
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

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const AdminUsuarios = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    role: "editor" as "master" | "editor" | "viewer",
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getAllProfiles();
      setUsers(data);
    } catch (error: unknown) {
      console.error("Error loading users:", error);
      showError(getErrorMessage(error, "Erro ao carregar usuários."));
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (user: Profile) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.full_name || "",
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSubmittingEdit(true);

    try {
      const masterCount = users.filter((user) => user.role === "master").length;
      if (editingUser.role === "master" && editForm.role !== "master" && masterCount <= 1) {
        showError("Não é possível remover a função do último administrador.");
        return;
      }

      await profileService.updateProfile(editingUser.id, {
        full_name: editForm.fullName,
        role: editForm.role,
      });
      showSuccess("Usuário atualizado com sucesso.");
      setEditDialogOpen(false);
      await loadUsers();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao atualizar usuário"));
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteUser = async (targetUser: Profile) => {
    try {
      if (targetUser.id === currentUser?.id) {
        showError("Você não pode remover o seu próprio usuário.");
        return;
      }

      const masterCount = users.filter((user) => user.role === "master").length;
      if (targetUser.role === "master" && masterCount <= 1) {
        showError("Não é possível remover o último administrador.");
        return;
      }

      await profileService.deleteProfile(targetUser.id);
      showSuccess(`Usuário ${targetUser.full_name || targetUser.email} removido do sistema.`);
      await loadUsers();
    } catch (error: unknown) {
      showError(getErrorMessage(error, "Erro ao remover usuário"));
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      master: "bg-purple-100 text-purple-800",
      editor: "bg-blue-100 text-blue-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    const labels = {
      master: "Administrador",
      editor: "Editor",
      viewer: "Visualizador",
    };
    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <PermissionGate allowedRoles={["master"]}>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </PermissionGate>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum profile encontrado</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Nenhum usuário cadastrado no sistema ainda.
            </p>
            <PermissionGate allowedRoles={["master"]}>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Adicionar primeiro usuário
              </Button>
            </PermissionGate>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="flex gap-1">
                    <PermissionGate allowedRoles={["master"]} fallback={<></>}>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{user.full_name || user.email}"?
                              Isso removerá apenas o profile em public.profiles. O usuário de
                              autenticação permanecerá ativo no Supabase.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PermissionGate>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{user.full_name || "Sem nome"}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Cadastrado em {new Date(user.created_at).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar usuário manualmente</DialogTitle>
            <DialogDescription>
              A criação automática pelo painel está temporariamente desativada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Crie o usuário em Supabase Authentication &gt; Users. Depois volte aqui
              para ajustar a função.
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" onClick={() => setCreateDialogOpen(false)}>
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>
              Altere o nome exibido e a função deste profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Função</Label>
              <Select
                value={editForm.role}
                onValueChange={(value: "master" | "editor" | "viewer") =>
                  setEditForm({ ...editForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="master">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submittingEdit}>
                {submittingEdit ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsuarios;
