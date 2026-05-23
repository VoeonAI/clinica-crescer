import { useEffect, useState } from "react";
import { authService, Profile } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Mail, Shield, Trash2, Key, RefreshCw, AlertCircle } from "lucide-react";
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
  const [newUser, setNewUser] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "editor" as "master" | "editor" | "viewer",
  });
  const [syncMode, setSyncMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getProfiles();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      showError("Erro ao carregar usuários. Verifique o console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (syncMode) {
        await authService.syncExistingUser(newUser.email, newUser.role, newUser.fullName);
        showSuccess("Usuário sincronizado com sucesso!");
      } else {
        await authService.createInvite(newUser.email, newUser.role, newUser.fullName);
        showSuccess("Usuário criado com sucesso. Uma senha temporária foi enviada por email.");
      }
      setDialogOpen(false);
      setNewUser({ email: "", fullName: "", password: "", role: "editor" });
      setSyncMode(false);
      loadUsers();
    } catch (error: any) {
      showError(error.message || "Erro ao criar usuário");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await authService.delete(id);
      showSuccess("Usuário excluído com sucesso");
      loadUsers();
    } catch (error) {
      showError("Erro ao excluir usuário");
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      master: "bg-purple-100 text-purple-800",
      editor: "bg-blue-100 text-blue-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={colors[role as keyof typeof colors]}>
        {role === "master" ? "Administrador" : role === "editor" ? "Editor" : "Visualizador"}
      </Badge>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <PermissionGate allowedRoles={["master"]}>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {syncMode ? "Sincronizar Usuário Existente" : "Adicionar Novo Usuário"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                {!syncMode && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha Temporária *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const tempPassword = Math.random().toString(36).slice(-8);
                          setNewUser({ ...newUser, password: tempPassword });
                        }}
                        title="Gerar senha aleatória"
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      O usuário deverá alterar esta senha após o primeiro login.
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="role">Função *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Visualizador</SelectItem>
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
                    Sincronizar usuário existente no Authentication
                  </Label>
                </div>
                {syncMode && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Modo de sincronização</p>
                      <p>
                        Isso vai criar/atualizar o profile para um usuário que já existe no Authentication.
                        Não altera a senha do usuário.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setNewUser({ email: "", fullName: "", password: "", role: "editor" });
                      setSyncMode(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Processando..." : syncMode ? "Sincronizar" : "Criar Usuário"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionGate>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum profile encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Usuários do Authentication precisam ter registro em public.profiles.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Use a opção "Sincronizar usuário existente" para criar profiles para usuários que já existem no Supabase Auth.
              </p>
              <PermissionGate allowedRoles={["master"]}>
                <Button onClick={() => setDialogOpen(true)}>
                  Adicionar usuário
                </Button>
              </PermissionGate>
            </div>
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
                  <PermissionGate allowedRoles={["master"]}>
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
                            Tem certeza que deseja excluir {user.full_name}? Esta ação não pode ser
                            desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </PermissionGate>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">{user.full_name}</h3>
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
    </div>
  );
};

export default AdminUsuarios;