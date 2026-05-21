import { PublicPage } from "@/components/PublicPage";
import { FAQSchema } from "@/components/Schemas";

const PrecisaDeAjuda = () => {
  const faqs = [
    {
      question: "Quais são os principais sinais de atraso no desenvolvimento?",
      answer: "Os principais sinais incluem atraso na fala, dificuldade de interação social, comportamentos repetitivos, dificuldades motoras e problemas de atenção. Cada criança tem seu tempo, mas persistência em certas dificuldades merece atenção profissional."
    },
    {
      question: "A partir de que idade devo observar os marcos do desenvolvimento?",
      answer: "Os marcos do desenvolvimento devem ser observados desde o nascimento. Os primeiros 3 anos são cruciais para identificar possíveis atrasos. É importante estar atento a marcos como sorriso social, balbucio, primeira palavra, caminhar, entre outros."
    },
    {
      question: "Quais profissões podem ajudar a identificar esses sinais?",
      answer: "Pediatras, neuropediatras, fonoaudiólogos, psicólogos, terapeutas ocupacionais e psicopedagogos são profissionais capacitados para identificar sinais de alerta no desenvolvimento infantil."
    }
  ];

  return (
    <PublicPage
      title="Como Saber Se Meu Filho Precisa de Ajuda"
      description="Identifique sinais de alerta no desenvolvimento infantil e saiba quando procurar avaliação profissional. Orientações para pais."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Precisa de Ajuda?', url: '/como-saber-se-meu-filho-precisa-de-ajuda' }
      ]}
    >
      <FAQSchema faqs={faqs} />

      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Sinais de Alerta por Idade</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">0-12 meses</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Não sorri aos 3 meses</li>
                <li>• Não segue objetos com o olhar</li>
                <li>• Não balbucia aos 6 meses</li>
                <li>• Não senta com apoio aos 8 meses</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">12-24 meses</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Não anda aos 18 meses</li>
                <li>• Não fala palavras simples</li>
                <li>• Não aponta para objetos</li>
                <li>• Não faz contato visual</li>
              </ul>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold mb-2">2-3 anos</h3>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Não forma frases simples</li>
                <li>• Não brinca de faz-de-conta</li>
                <li>• Não interage com outras crianças</li>
                <li>• Apresenta regressão de habilidades adquiridas</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O Que Fazer?</h2>
          <p className="text-muted-foreground mb-4">
            Se você identificar algum desses sinais, não entre em pânico. Cada criança 
            tem seu ritmo de desenvolvimento. O importante é:
          </p>
          <ol className="text-muted-foreground space-y-2 list-decimal pl-6">
            <li>Converse com seu pediatra sobre suas observações</li>
            <li>Busque uma avaliação profissional especializada</li>
            <li>Mantenha registros do desenvolvimento da criança</li>
            <li>Não Compare seu filho com outras crianças</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/sinais-de-alerta-no-desenvolvimento-infantil" className="text-primary hover:underline">Sinais de Alerta no Desenvolvimento Infantil</a></li>
          <li><a href="/quando-procurar-avaliacao" className="text-primary hover:underline">Quando Procurar Avaliação</a></li>
          <li><a href="/avaliacao-neuropsicologica" className="text-primary hover:underline">Avaliação Neuropsicológica</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default PrecisaDeAjuda;