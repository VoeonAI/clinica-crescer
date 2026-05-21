import { PublicPage } from "@/components/PublicPage";

const AvaliacaoNeuropsicologica = () => {
  return (
    <PublicPage
      title="Avaliação Neuropsicológica"
      description="Entenda o que é a avaliação neuropsicológica, como funciona e como pode ajudar no desenvolvimento infantil."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Avaliação Neuropsicológica', url: '/avaliacao-neuropsicologica' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O que é Avaliação Neuropsicológica?</h2>
          <p className="text-muted-foreground mb-4">
            A avaliação neuropsicológica é um processo detalhado que investiga o 
            funcionamento cognitivo, emocional e comportamental de uma pessoa. 
            No contexto infantil, é fundamental para entender como a criança 
            aprende, processa informações e se comporta.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O que é Avaliado?</h2>
          
          <div className="grid gap-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Funções Cognitivas</h3>
              <p className="text-sm text-muted-foreground">
                Atenção, concentração, memória, raciocínio e resolução de problemas.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Linguagem</h3>
              <p className="text-sm text-muted-foreground">
                Compreensão, expressão, leitura e escrita.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Funções Executivas</h3>
              <p className="text-sm text-muted-foreground">
                Planejamento, organização, flexibilidade mental e controle de impulsos.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Habilidades Motoras</h3>
              <p className="text-sm text-muted-foreground">
                Coordenação fina e grossa, velocidade e precisão de movimentos.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Como Funciona o Processo?</h2>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <div>
                <strong>Anamnese:</strong> Entrevista com os pais para了解 histórico de 
                desenvolvimento, saúde e contexto familiar.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <div>
                <strong>Aplicação de Testes:</strong> Realização de testes padronizados 
                em sessões individuais com a criança.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <div>
                <strong>Análise dos Resultados:</strong> Neuropsicólogo analisa os dados 
                e prepara um relatório detalhado.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <div>
                <strong>Devolutiva:</strong> Reunião com os pais para apresentar resultados 
                e orientações.
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Benefícios da Avaliação</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Identificação precisa de dificuldades e potencialidades</li>
            <li>• Diagnóstico diferencial de condições como TDAH, TEA, dislexia</li>
            <li>• Orientação para estratégias de intervenção adequadas</li>
            <li>• Base para adaptações escolares quando necessário</li>
            <li>• Acompanhamento da evolução ao longo do tempo</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/quando-procurar-avaliacao" className="text-primary hover:underline">Quando Procurar Avaliação</a></li>
          <li><a href="/terapia-aba" className="text-primary hover:underline">Terapia ABA</a></li>
          <li><a href="/sobre" className="text-primary hover:underline">Conheça Nossa Equipe</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default AvaliacaoNeuropsicologica;