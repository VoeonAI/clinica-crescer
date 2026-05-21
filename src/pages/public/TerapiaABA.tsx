import { PublicPage } from "@/components/PublicPage";

const TerapiaABA = () => {
  return (
    <PublicPage
      title="Terapia ABA"
      description="Conheça a Análise do Comportamento Aplicada (ABA), uma abordagem cientificamente comprovada para desenvolvimento infantil."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Terapia ABA', url: '/terapia-aba' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O que é Terapia ABA?</h2>
          <p className="text-muted-foreground mb-4">
            A Análise do Comportamento Aplicada (ABA) é uma ciência que estuda o 
            comportamento humano e utiliza princípios de aprendizagem para ensinar 
            habilidades e reduzir comportamentos desafiadores. É especialmente 
            eficaz no tratamento do Transtorno do Espectro Autista (TEA).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Princípios Fundamentais</h2>
          
          <div className="grid gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Reforço Positivo</h3>
              <p className="text-sm text-muted-foreground">
                Uso de consequências positivas para aumentar comportamentos desejáveis, 
                tornando a aprendizagem motivadora.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Análise de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Registro sistemático do progresso para garantir que as intervenções 
                são eficazes e fazer ajustes quando necessário.
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Individualização</h3>
              <p className="text-sm text-muted-foreground">
                Cada programa é desenvolvido especificamente para as necessidades 
                únicas de cada criança e família.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Habilidades Trabalhadas</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Comunicação</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Linguagem verbal</li>
                <li>• Comunicação alternativa</li>
                <li>• Compreensão de instruções</li>
              </ul>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Socialização</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Interação com pares</li>
                <li>• Compartilhamento</li>
                <li>• Jogos cooperativos</li>
              </ul>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Autonomia</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Habilidades de autocuidado</li>
                <li>• Rotinas diárias</li>
                <li>• Independência</li>
              </ul>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Acadêmico</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pré-requisitos escolares</li>
                <li>• Atenção e seguimento de instruções</li>
                <li>• Habilidades de aprendizagem</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Envolvimento da Família</h2>
          <p className="text-muted-foreground mb-4">
            O sucesso da terapia ABA depende fortemente do envolvimento da família. 
            Os pais são orientados a:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Participar de sessões de treinamento</li>
            <li>• Aplicar estratégias no dia a dia</li>
            <li>• Manter consistência entre terapia e casa</li>
            <li>• Comunicar dúvidas e progressos à equipe</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/avaliacao-neuropsicologica" className="text-primary hover:underline">Avaliação Neuropsicológica</a></li>
          <li><a href="/orientacao-parental" className="text-primary hover:underline">Orientação Parental</a></li>
          <li><a href="/sobre" className="text-primary hover:underline">Nossa Equipe</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default TerapiaABA;