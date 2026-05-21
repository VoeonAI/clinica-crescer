import { PublicPage } from "@/components/PublicPage";

const SinaisAlerta = () => {
  return (
    <PublicPage
      title="Sinais de Alerta no Desenvolvimento Infantil"
      description="Conheça os principais sinais que podem indicar necessidade de intervenção profissional no desenvolvimento infantil."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Sinais de Alerta', url: '/sinais-de-alerta-no-desenvolvimento-infantil' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Áreas de Desenvolvimento</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Desenvolvimento da Linguagem
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Atraso na primeira palavra</li>
                <li>• Dificuldade em formar frases</li>
                <li>• Problemas de compreensão</li>
                <li>• Falta de comunicação não-verbal</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Desenvolvimento Social
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Falta de contato visual</li>
                <li>• Não responde ao nome</li>
                <li>• Dificuldade de interação</li>
                <li>• Prefere ficar isolado</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Desenvolvimento Motor
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Atraso em sentar, engatinhar, andar</li>
                <li>• Dificuldades de coordenação</li>
                <li>• Movimentos repetitivos</li>
                <li>• Hipotonia ou hipertonia</li>
              </ul>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                Comportamental
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Comportamentos repetitivos</li>
                <li>• Apego excessivo a rotinas</li>
                <li>• Hiperatividade</li>
                <li>• Agressividade ou retraimento</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Importância da Intervenção Precoce</h2>
          <p className="text-muted-foreground mb-4">
            A neuroplasticidade cerebral é maior nos primeiros anos de vida. 
            Intervenções precoces podem:
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>• Maximizar o potencial de desenvolvimento</li>
            <li>• Minimizar déficits secundários</li>
            <li>• Melhorar qualidade de vida da criança e família</li>
            <li>• Prevenir dificuldades escolares futuras</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/como-saber-se-meu-filho-precisa-de-ajuda" className="text-primary hover:underline">Como Saber Se Meu Filho Precisa de Ajuda</a></li>
          <li><a href="/quando-procurar-avaliacao" className="text-primary hover:underline">Quando Procurar Avaliação</a></li>
          <li><a href="/blog" className="text-primary hover:underline">Blog - Artigos Especializados</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default SinaisAlerta;