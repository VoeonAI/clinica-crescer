import { useEffect, useState } from "react";
import { authService, Profile } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Mail, Shield, Trash2, Key, AlertCircle, Edit } from "lucide-react";
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

const AdminUsuarios = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal de Criação
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "editor" as "master" | "editor" | "viewer",
  });
  const [syncMode, setSyncMode] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Modal de Edição
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
    } catch (error) {
      console.error('Error loading users:', error);
      showError("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreate(true);

    try {
      if (syncMode) {
        await authService.syncExistingUser(newUser.email, newUser.role, newUser.fullName);
        showSuccess("Usuário sincronizado com sucesso!");
      } else {
        await authService.createAdminUser(newUser.fullName, newUser.email, newUser.password, newUser.role);
        showSuccess("Usuário criado com sucesso.");
      }
      setCreateDialogOpen(false);
      resetCreateForm();
      loadUsers();
    } catch (error: any) {
      showError(error.message || "Erro ao criar usuário");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const resetCreateForm = () => {
    setNewUser({ email: "", fullName: "", password: "", role: "editor" });
    setSyncMode(false);
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
      await profileService.updateProfile(editingUser.id, {
        full_name: editForm.fullName,
        role: editForm.role,
      });
      showSuccess("Usuário atualizado com sucesso.");
      setEditDialogOpen(false);
      loadUsers();
    } catch (error) {
      showError("Erro ao atualizar usuário");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    try {
      await authService.deleteUser(id);
      showSuccess(`Usuário ${name} removido do sistema.`);
      loadUsers();
    } catch (error) {
      showError("Erro ao remover usuário");
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
                              Isso removerá o acesso ao sistema. O usuário de autenticação permanecerá ativo no Supabase.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
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

      {/* Modal Criar Usuário */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {syncMode ? "Sincronizar Usuário" : "Criar Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome Completo *</Label>
              <Input
                id="create-name"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            {!syncMode && (
              <div className="space-y-2">
                <Label htmlFor="create-password">Senha Temporária *</Label>
                <div className="flex gap-2">
                  <Input
                    id="create-password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setNewUser({ ...newUser, password: Math.random().toString(36).slice(-8) })}
                  >
                    <Key className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="create-role">Função *</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
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
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
              <Switch
                id="sync-mode"
                checked={syncMode}
                onCheckedChange={setSyncMode}
              />
              <Label htmlFor="sync-mode" className="text-sm cursor-pointer">
                Sincronizar usuário existente
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setCreateDialogOpen(false); resetCreateForm(); }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submittingCreate}>
                {submittingCreate ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Usuário */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
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
                onValueChange={(value: any) => setEditForm({ ...editForm, role: value })}
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