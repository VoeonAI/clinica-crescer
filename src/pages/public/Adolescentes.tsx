import { PublicPage } from "@/components/PublicPage";

const Adolescentes = () => {
  return (
    <PublicPage
      title="Atendimento para Adolescentes"
      description="Oferecemos suporte especializado para adolescentes, com foco em desenvolvimento emocional, social e acadêmico."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Adolescentes', url: '/adolescentes' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Atendimento Especializado</h2>
          <p className="text-muted-foreground mb-4">
            A adolescência é uma fase de transformações intensas. Nosso atendimento 
            para adolescentes oferece suporte profissional para lidar com os desafios 
            dessa etapa do desenvolvimento, sempre com respeito e acolhimento.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Áreas de Atuação</h2>
          
          <div className="grid gap-4">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Saúde Mental</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Apoio para ansiedade, depressão, transtornos de humor, 
                autoestima e imagem corporal.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gestão de emoções</li>
                <li>• Desenvolvimento de resiliência</li>
                <li>• Estratégias de enfrentamento</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Desenvolvimento Social</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Trabalho de habilidades sociais, relacionamentos e inserção 
                no grupo de pares.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comunicação assertiva</li>
                <li>• Resolução de conflitos</li>
                <li>• Estabelecimento de limites</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3">Apoio Escolar</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Orientação para dificuldades de aprendizagem, organização, 
                foco e preparação para exames.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Estratégias de estudo</li>
                <li>• Gestão do tempo</li>
                <li>• Orientação vocacional</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Abordagem Terapêutica</h2>
          <p className="text-muted-foreground mb-4">
            Nosso trabalho com adolescentes utiliza uma abordagem que:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Valoriza a autonomia e responsabilização do jovem</li>
            <li>• Mantém sigilo e ética profissional</li>
            <li>• Envolvimento familiar quando apropriado</li>
            <li>• Adapta estratégias às necessidades individuais</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/avaliacao-neuropsicologica" className="text-primary hover:underline">Avaliação Neuropsicológica</a></li>
          <li><a href="/orientacao-parental" className="text-primary hover:underline">Orientação Parental</a></li>
          <li><a href="/sobre" className="text-primary hover:underline">Conheça Nossa Equipe</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default Adolescentes;