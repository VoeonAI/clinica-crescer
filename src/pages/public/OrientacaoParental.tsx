import { PublicPage } from "@/components/PublicPage";

const OrientacaoParental = () => {
  return (
    <PublicPage
      title="Orientação Parental"
      description="Apoio e orientações para pais na criação e educação dos filhos, fortalecendo o vínculo familiar."
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Orientação Parental', url: '/orientacao-parental' }
      ]}
    >
      <div className="max-w-3xl mx-auto prose">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O que é Orientação Parental?</h2>
          <p className="text-muted-foreground mb-4">
            A orientação parental é um processo que oferece suporte aos pais e cuidadores 
            no desenvolvimento de habilidades parentais, ajudando-os a lidar com os 
            desafios da criação dos filhos de forma mais consciente e efetiva.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">O que é Trabalhado?</h2>
          
          <div className="grid gap-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Comunicação Efetiva</h3>
              <p className="text-sm text-muted-foreground">
                Desenvolvimento de estratégias de comunicação que fortaleçam o 
                vínculo pais-filhos e reduzam conflitos.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Estabelecimento de Limites</h3>
              <p className="text-sm text-muted-foreground">
                Ensino de técnicas para estabelecer regras claras e consistentes, 
                com consequências adequadas e positivas.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Gestão Emocional</h3>
              <p className="text-sm text-muted-foreground">
                Apoio para os pais lidarem com suas próprias emoções e ajudarem 
                os filhos a desenvolverem inteligência emocional.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-semibold">Estratégias de Disciplina Positiva</h3>
              <p className="text-sm text-muted-foreground">
                Alternativas à punição que promovem aprendizagem e desenvolvimento 
                de autocontrole na criança.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-primary">Benefícios para a Família</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Fortalecimento do vínculo pais-filhos</li>
            <li>• Redução de conflitos familiares</li>
            <li>• Melhoria no comportamento das crianças</li>
            <li>• Maior segurança e confiança dos pais</li>
            <li>• Ambiente familiar mais harmonioso</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">Como Funciona?</h2>
          <p className="text-muted-foreground mb-4">
            As sessões de orientação parental podem ser:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Individuais - focadas nas necessidades específicas da família</li>
            <li>• Em grupo - permitindo troca de experiências entre pais</li>
            <li>• Temáticas - abordando assuntos específicos como sono, alimentação, etc.</li>
          </ul>
        </section>
      </div>

      <section className="mt-12 p-6 bg-accent rounded-lg max-w-3xl mx-auto">
        <h3 className="font-semibold mb-2">Veja também</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="/como-saber-se-meu-filho-precisa-de-ajuda" className="text-primary hover:underline">Como Saber Se Meu Filho Precisa de Ajuda</a></li>
          <li><a href="/terapia-aba" className="text-primary hover:underline">Terapia ABA</a></li>
          <li><a href="/blog" className="text-primary hover:underline">Blog - Artigos para Pais</a></li>
        </ul>
      </section>
    </PublicPage>
  );
};

export default OrientacaoParental;