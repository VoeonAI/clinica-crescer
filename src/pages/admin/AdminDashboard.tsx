import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogService } from "@/services/blogService";
import { staffService } from "@/services/staffService";
import { authService } from "@/services/authService";
import { FileText, Users, UserCog } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    posts: 0,
    publishedPosts: 0,
    staff: 0,
    activeStaff: 0,
    users: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [posts, staff, users] = await Promise.all([
        blogService.getAdminPosts(),
        staffService.getAdminStaff(),
        authService.getProfiles(),
      ]);

      setStats({
        posts: posts.length,
        publishedPosts: posts.filter((p) => p.published).length,
        staff: staff.length,
        activeStaff: staff.filter((s) => s.is_active).length,
        users: users.length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total de Posts",
      value: stats.posts,
      subtitle: `${stats.publishedPosts} publicados`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Equipe",
      value: stats.staff,
      subtitle: `${stats.activeStaff} ativos`,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Usuários",
      value: stats.users,
      subtitle: "Cadastrados no sistema",
      icon: UserCog,
      color: "text-purple-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Use o menu lateral para navegar entre as seções do CMS.
          </p>
          <div className="space-y-2 text-sm">
            <p>• <strong>Blog:</strong> Gerencie artigos, categorias e conteúdo</p>
            <p>• <strong>Equipe:</strong> Cadastre e gerencie profissionais</p>
            <p>• <strong>Usuários:</strong> Gerencie acessos e permissões</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;