import { PublicPage } from "@/components/PublicPage";

const Index = () => {
  return (
    <PublicPage
      title="Clínica Crescer"
      description="Acolhimento, desenvolvimento e transformação para crianças e famílias."
    >
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Sobre Nós</h2>
          <p className="text-muted-foreground mb-4">
            A Clínica Crescer é especializada em desenvolvimento infantil, oferecendo 
            atendimento multidisciplinar com foco em neuropsicologia, terapia ABA e 
            orientação familiar.
          </p>
          <p className="text-muted-foreground">
            Nossa equipe de profissionais altamente qualificados trabalha de forma 
            integrada para promover o desenvolvimento saudável e o bem-estar de 
            crianças e adolescentes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Nossos Serviços</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Avaliação Neuropsicológica</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Terapia ABA (Análise do Comportamento Aplicada)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Atendimento para Adolescentes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Orientação Parental</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6 text-primary">Precisa de Ajuda?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Identificar sinais de alerta no desenvolvimento infantil é fundamental para 
          uma intervenção precoce e eficaz. Saiba mais sobre quando procurar ajuda.
        </p>
        <a
          href="/como-saber-se-meu-filho-precisa-de-ajuda"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Saiba Mais
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-primary">Últimas do Blog</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 bg-card">
              <div className="h-40 bg-muted rounded mb-4"></div>
              <h3 className="font-semibold mb-2">Artigo em Destaque {i}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Breve descrição do artigo sobre desenvolvimento infantil...
              </p>
              <a href="/blog/artigo-{i}" className="text-primary text-sm hover:underline">
                Ler mais →
              </a>
            </div>
          ))}
        </div>
      </section>
    </PublicPage>
  );
};

export default Index;