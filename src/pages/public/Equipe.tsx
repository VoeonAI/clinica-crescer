import { PublicPage } from "@/components/PublicPage";
import { staffService, StaffMember } from "@/services/staffService";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Equipe = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffService.getActiveStaff();
      setStaff(data);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicPage
      title="Nossa Equipe"
      description="Conheça os profissionais especializados da Clínica Crescer"
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Nossa Equipe", url: "/equipe" }
      ]}
    >
      {loading ? (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum profissional cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {staff.map((member) => (
            <div key={member.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center mb-6">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-muted mb-4 flex items-center justify-center">
                    <span className="text-3xl text-muted-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-xl text-primary mb-2">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{member.role_title}</p>
                {member.specialties && member.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {member.bio && (
                <p className="text-sm text-muted-foreground text-center line-clamp-4">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </PublicPage>
  );
};

export default Equipe;