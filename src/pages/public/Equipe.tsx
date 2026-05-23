import { PublicPage } from "@/components/PublicPage";
import { staffService, StaffMember } from "@/services/staffService";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

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

  const founder = staff.find(m => m.member_type === 'founder');
  const therapists = staff.filter(m => m.member_type === 'therapist');
  const staffMembers = staff.filter(m => m.member_type === 'staff');

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
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Founder skeleton */}
          <div className="text-center">
            <Skeleton className="w-40 h-40 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
          </div>
          {/* Therapists skeleton */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum profissional cadastrado ainda.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Founder / Idealizadora */}
          {founder && (
            <section className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-300" />
                  <span className="font-semibold">Idealizadora</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-2xl p-8 md:p-12 border-2 border-primary/20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    {founder.photo_url ? (
                      <img
                        src={founder.photo_url}
                        alt={founder.name}
                        className="w-64 h-64 rounded-full object-cover shadow-2xl border-4 border-white"
                      />
                    ) : (
                      <div className="w-64 h-64 rounded-full bg-muted flex items-center justify-center shadow-2xl border-4 border-white">
                        <span className="text-6xl text-muted-foreground font-semibold">
                          {founder.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-primary mb-3">{founder.name}</h2>
                    <p className="text-xl text-primary font-medium mb-6">{founder.role_title}</p>
                    
                    {founder.specialties && founder.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                        {founder.specialties.map((spec, i) => (
                          <span
                            key={i}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {founder.bio && (
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {founder.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Therapists */}
          {therapists.length > 0 && (
            <section>
              <h3 className="text-3xl font-bold text-center mb-8 text-primary">
                Nossos Terapeutas
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {therapists.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
                  >
                    <div className="flex flex-col items-center text-center mb-6">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-36 h-36 rounded-full object-cover mb-4 shadow-md"
                        />
                      ) : (
                        <div className="w-36 h-36 rounded-full bg-muted mb-4 flex items-center justify-center shadow-md">
                          <span className="text-3xl text-muted-foreground font-semibold">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-xl mb-2 text-primary">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-4">{member.role_title}</p>
                      {member.specialties && member.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {member.specialties.map((spec, i) => (
                            <span
                              key={i}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
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
            </section>
          )}

          {/* Staff Members */}
          {staffMembers.length > 0 && (
            <section>
              <h3 className="text-3xl font-bold text-center mb-8 text-primary">
                Funcionários
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                {staffMembers.map((member) => (
                  <div
                    key={member.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="flex flex-col items-center text-center">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-24 h-24 rounded-full object-cover mb-3"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-muted mb-3 flex items-center justify-center">
                          <span className="text-xl text-muted-foreground">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <h4 className="font-semibold mb-1 text-primary">{member.name}</h4>
                      <p className="text-xs text-primary font-medium mb-2">{member.role_title}</p>
                      {member.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PublicPage>
  );
};

export default Equipe;