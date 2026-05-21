import { PublicPage } from "@/components/PublicPage";

const QuandoProcurarAvaliacao = () => {
  return (
    <PublicPage
      title="Quando Procurar Avaliação"
      description="Saiba em quais situações é importante buscar avaliação profissional especializada para seu filho."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Quando Procurar Avaliação', url: '/quando-procurar-avaliacao' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Situações que Indicam Avaliação</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-3">🚩 Atraso nos Marcos do Desenvolvimento</h3>
              <p className="text-muted-foreground text-sm">
                Se a criança não está atingindo os marcos esperados para sua idade, 
                como sorrir, sentar, andar, falar ou interajar socialmente.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-3">🚩 Regressão de Habilidades</h3>
              <p className="text-muted-foreground text-sm">
                Quando a criança perde habilidades que já tinha adquirido, como 
                deixar de falar palavras que antes dizia.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-3">🚩 Dificuldades Escolares</h3>
              <p className="text-muted-foreground text-sm">
                Problemas persistentes na aprendizagem, atenção, comportamento em sala 
                de aula ou socialização com colegas.
              </p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-semibold mb-3">🚩 Preocupação dos Pais</h3>
              <p className="text-muted-foreground text-sm">
                Pais conhecem seus filhos melhor do que ninguém. Se você tem preocupação, 
                vale a pena buscar orientação profissional.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Tipos de Avaliação</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Avaliação Neuropsicológica</h4>
              <p className="text-sm text-muted-foreground">
                Avalia funções cognitivas, atenção, memória, linguagem e funções executivas.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Avaliação Fonoaudiológica</h4>
              <p className="text-sm text-muted-foreground">
                Avalia linguagem, fala, comunicação e deglutição.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Avaliação Psicomotora</h4>
              <p className="text-sm text-muted-foreground">
                Avalia desenvolvimento motor, coordenação e organização espacial.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Avaliação Comportamental</h4>
              <p className="text-sm text-muted-foreground">
                Avalia comportamentos, habilidades sociais e funcionamento adaptativo.
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/avaliacao-neuropsicologica" className="text-primary hover:underline">Avaliação Neuropsicológica</a></li>
          <li><a href="/sobre" className="text-primary hover:underline">Sobre Nossa Equipe</a></li>
          <li><a href="/blog" className="text-primary hover:underline">Blog - Orientações Especializadas</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default QuandoProcurarAvaliacao;