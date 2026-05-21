import { PublicPage } from "@/components/PublicPage";

const Sobre = () => {
  return (
    <PublicPage
      title="Sobre a Clínica Crescer"
      description="Conheça nossa história, missão e equipe multidisciplinar especializada em desenvolvimento infantil."
      breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Sobre', url: '/sobre' }]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Nossa História</h2>
          <p className="text-muted-foreground">
            A Clínica Crescer nasceu do desejo de oferecer um atendimento humanizado 
            e especializado para crianças e famílias que enfrentam desafios no 
            desenvolvimento. Desde nossa fundação, buscamos integrar evidências 
            científicas com acolhimento e respeito às individualidades de cada paciente.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Nossa Missão</h2>
          <p className="text-muted-foreground mb-4">
            Promover o desenvolvimento saudável de crianças e adolescentes através de 
            atendimento especializado, integrado e baseado em evidências científicas, 
            sempre com foco no bem-estar da família como um todo.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Nossos Valores</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Acolhimento e respeito à diversidade</li>
            <li>• Ética profissional e responsabilidade</li>
            <li>• Atualização científica constante</li>
            <li>• Trabalho em equipe multidisciplinar</li>
            <li>• Foco na família como parceira do tratamento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Equipe</h2>
          <p className="text-muted-foreground mb-6">
            Conheça nossos profissionais especializados.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">Profissional {i}</h3>
                <p className="text-sm text-muted-foreground">Especialidade</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/avaliacao-neuropsicologica" className="text-primary hover:underline">Avaliação Neuropsicológica</a></li>
          <li><a href="/terapia-aba" className="text-primary hover:underline">Terapia ABA</a></li>
          <li><a href="/blog" className="text-primary hover:underline">Blog - Artigos e Orientações</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default Sobre;