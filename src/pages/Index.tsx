import { PublicPage } from "@/components/PublicPage";
import { Calendar, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { blogService, BlogPost } from "@/services/blogService";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    loadLatestPosts();
  }, []);

  const loadLatestPosts = async () => {
    try {
      const data = await blogService.getAllPublished();
      setLatestPosts(data.slice(0, 3));
    } catch (error) {
      console.error("Error loading latest posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const faqData = [
    {
      question: "Como saber se meu filho precisa de avaliação?",
      answer: "Se você observar atrasos em marcos do desenvolvimento, dificuldades de aprendizagem, problemas de comportamento ou se simplesmente tiver preocupações, vale a pena buscar uma avaliação especializada. A intervenção precoce é fundamental.",
    },
    {
      question: "Qual a idade mínima para iniciar o acompanhamento?",
      answer: "Trabalhamos com crianças e adolescentes. Quanto mais cedo a intervenção começar, melhores os resultados. Para crianças muito pequenas, focamos em desenvolvimento e orientação familiar.",
    },
    {
      question: "Como a família participa do processo?",
      answer: "A família é essencial. Realizamos sessões de orientação parental, ensinamos estratégias para aplicar em casa, e mantemos comunicação constante. A terapia continua no dia a dia através das práticas aprendidas.",
    },
    {
      question: "Quanto tempo dura o tratamento?",
      answer: "Varia de acordo com as necessidades de cada pessoa. Alguns acompanhamentos são curtos e focados, outros podem ser mais prolongados. Trabalhamos sempre com metas claras e revisões periódicas.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Clínica Crescer | Intervenção que faz sentido fora da clínica"
        description="Na Clínica Crescer, a terapia não termina na sessão. Transformamos intervenção especializada em evolução funcional na vida real, com participação ativa da família e decisões baseadas em dados."
        keywords="clínica infantil, desenvolvimento infantil, terapia ABA, neuropsicologia, intervenção precoce"
      />
      <MedicalClinicSchema />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Intervenção que faz sentido fora da clínica.
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
            Na Clínica Crescer, a terapia não termina na sessão. Nós transformamos 
            intervenção especializada em evolução funcional na vida real, com participação 
            ativa da família e decisões baseadas em dados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/precisa-de-ajuda"
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Preciso de Ajuda
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center justify-center bg-primary-foreground/20 text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors border border-primary-foreground/30"
            >
              Conhecer a Clínica
            </Link>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Para quem é a Clínica Crescer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Oferecemos suporte especializado para crianças e adolescentes que enfrentam 
              desafios no desenvolvimento, bem como para suas famílias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🧒</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Crianças</h3>
              <p className="text-muted-foreground mb-4">
                Crianças que apresentam atrasos no desenvolvimento, dificuldades de 
                aprendizagem, desafios comportamentais ou questões socioemocionais.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Atrasos na fala ou linguagem</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Dificuldades na interação social</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Problemas de atenção e foco</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">👩</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Adolescentes</h3>
              <p className="text-muted-foreground mb-4">
                Adolescentes que enfrentam desafios emocionais, sociais, acadêmicos 
                ou de comportamento durante essa fase de transição.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Ansiedade e depressão</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Dificuldades escolares</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Questões de identidade</span>
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">👨‍👩‍👧</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-primary">Famílias</h3>
              <p className="text-muted-foreground mb-4">
                Pais e cuidadores que buscam orientação, estratégias e suporte 
                para lidar com os desafios do desenvolvimento infantil.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Orientação parental</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Estratégias para casa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Suporte emocional</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quando é hora de investigar */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Quando é hora de investigar?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Identificar sinais de alerta no desenvolvimento infantil é fundamental 
                para uma intervenção precoce e eficaz. Conheça os principais indicadores 
                que merecem atenção profissional.
              </p>
              <Link
                to="/precisa-de-ajuda"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                Ver lista completa de sinais de alerta
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  0-12 meses
                </h3>
                <p className="text-muted-foreground text-sm">
                  Não sorri aos 3 meses, não segue objetos com o olhar, não balbucia 
                  aos 6 meses ou não senta com apoio aos 8 meses.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  12-24 meses
                </h3>
                <p className="text-muted-foreground text-sm">
                  Não anda aos 18 meses, não fala palavras simples, não aponta para 
                  objetos ou não faz contato visual.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  2-3 anos
                </h3>
                <p className="text-muted-foreground text-sm">
                  Não forma frases simples, não brinca de faz-de-conta, não interage 
                  com outras crianças ou apresenta regressão de habilidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que uma avaliação pode esclarecer */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              O que uma avaliação pode esclarecer
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A avaliação neuropsicológica é um processo detalhado que investiga o 
              funcionamento cognitivo, emocional e comportamental.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">
                Funções Cognitivas
              </h3>
              <p className="text-sm text-muted-foreground">
                Atenção, memória, raciocínio e resolução de problemas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">
                Linguagem
              </h3>
              <p className="text-sm text-muted-foreground">
                Compreensão, expressão, leitura e escrita
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">
                Funções Executivas
              </h3>
              <p className="text-sm text-muted-foreground">
                Planejamento, organização e controle de impulsos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏃</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">
                Habilidades Motoras
              </h3>
              <p className="text-sm text-muted-foreground">
                Coordenação, velocidade e precisão de movimentos
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/avaliacao-neuropsicologica"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Saiba mais sobre Avaliação Neuropsicológica
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Como funciona nosso processo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Um caminho estruturado, transparente e colaborativo para promover o 
              desenvolvimento funcional de cada criança e adolescente.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-white border rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg mb-3 text-primary">
                  Anamnese
                </h3>
                <p className="text-sm text-muted-foreground">
                  Entrevista com os pais para entender o histórico de desenvolvimento, 
                  saúde, escolaridade e contexto familiar.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg mb-3 text-primary">
                  Avaliação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Aplicação de testes padronizados e observações em sessões individuais 
                  com a criança ou adolescente.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg mb-3 text-primary">
                  Análise
                </h3>
                <p className="text-sm text-muted-foreground">
                  Profissional analisa os dados e prepara um relatório detalhado com 
                  diagnóstico ou hipóteses diagnósticas.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-bold text-lg mb-3 text-primary">
                  Devolutiva
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reunião com os pais para apresentar resultados, tirar dúvidas e 
                  definir plano de intervenção.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que muda na vida real */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              O que muda na vida real
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não buscamos mudanças apenas na clínica. Nosso objetivo é transformar 
              a vida diária da criança, da família e da escola.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">
                Em Casa
              </h3>
              <p className="text-muted-foreground mb-4">
                Melhor na rotina de sono e alimentação, menos conflitos, maior 
                autonomia nas atividades diárias e relação familiar mais harmoniosa.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Rotinas mais tranquilas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Menos birras e crises</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Maior independência</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">
                Na Escola
              </h3>
              <p className="text-muted-foreground mb-4">
                Melhor desempenho acadêmico, maior engajamento nas atividades, 
                melhor relação com colegas e professores, e adaptações quando necessárias.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Aprendizagem mais eficiente</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Melhor concentração</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Socialização positiva</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">😊</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">
                Na Vida Social
              </h3>
              <p className="text-muted-foreground mb-4">
                Habilidades sociais mais desenvolvidas, maior confiança, melhor 
                regulação emocional e maior capacidade de lidar com novas situações.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Comunicação eficaz</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Autoconfiança</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Resiliência emocional</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Por que escolher a Clínica Crescer?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa abordagem única combina evidência científica, acolhimento 
              humano e foco em resultados funcionais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Decisões Baseadas em Dados
              </h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos avaliações padronizadas e métricas objetivas para entender 
                as necessidades de cada criança e acompanhar a evolução ao longo do tempo.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍👩‍👧</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Família como Parceira
              </h3>
              <p className="text-sm text-muted-foreground">
                A família é essencial no processo. Enviamos estratégias, realizamos 
                orientações e mantemos comunicação constante para integrar a terapia 
                no dia a dia.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Base Científica
              </h3>
              <p className="text-sm text-muted-foreground">
                Todas as nossas intervenções são fundamentadas em evidências científicas 
                atualizadas, garantindo práticas eficazes e seguras.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Foco Funcional
              </h3>
              <p className="text-sm text-muted-foreground">
                Não trabalhamos apenas sintomas. Nosso objetivo é promover evolução 
                funcional que se reflita na vida real da criança e da família.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Abordagem Multidisciplinar
              </h3>
              <p className="text-sm text-muted-foreground">
                Equipe de profissionais de diferentes áreas trabalhando de forma 
                integrada para uma visão completa do desenvolvimento.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-primary">
                Acolhimento e Respeito
              </h3>
              <p className="text-sm text-muted-foreground">
                Valorizamos a diversidade, respeitamos as individualidades e criamos 
                um ambiente seguro e acolhedor para crianças e famílias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards para páginas internas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Conheça nossos serviços
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços especializados para atender 
              às diferentes necessidades de desenvolvimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/avaliacao-neuropsicologica"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Avaliação Neuropsicológica
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Investigação detalhada do funcionamento cognitivo, emocional e 
                comportamental para identificar necessidades e potencialidades.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Saiba mais
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/terapia-aba"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Terapia ABA
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Análise do Comportamento Aplicada: intervenção cientificamente 
                comprovada para desenvolvimento infantil.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Saiba mais
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/adolescentes"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-3xl">👩</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Atendimento para Adolescentes
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Suporte especializado para lidar com os desafios da adolescência, 
                sempre com respeito e acolhimento.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Saiba mais
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/orientacao-parental"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Orientação Parental
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Apoio para pais na criação e educação dos filhos, fortalecendo o 
                vínculo familiar.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Saiba mais
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/precisa-de-ajuda"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="text-3xl">❓</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Precisa de Ajuda?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Identifique sinais de alerta no desenvolvimento infantil e saiba 
                quando procurar avaliação profissional.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Saiba mais
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>

            <Link
              to="/blog"
              className="group border rounded-lg p-8 hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary group-hover:underline">
                Blog
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Artigos, dicas e orientações sobre desenvolvimento infantil, 
                neuropsicologia e terapia.
              </p>
              <span className="text-sm font-medium text-primary group-hover:underline flex items-center">
                Ver artigos
                <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Tire suas dúvidas sobre nosso trabalho
            </p>
          </div>

          <FAQSchema faqs={faqData} />

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="bg-white border rounded-lg group"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-lg text-primary pr-4">
                    {faq.question}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Entre em contato conosco para agendar uma avaliação ou tirar suas dúvidas. 
            Estamos aqui para ajudar sua família.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quando-procurar-avaliacao"
              className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Agendar Avaliação
              <Calendar className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center justify-center bg-primary-foreground/20 text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary-foreground/30 transition-colors border border-primary-foreground/30"
            >
              Conhecer a Clínica
            </Link>
          </div>
        </div>
      </section>

      {/* Últimos posts do blog */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  Últimas do Blog
                </h2>
                <p className="text-xl text-muted-foreground">
                  Artigos e orientações sobre desenvolvimento infantil
                </p>
              </div>
              <Link
                to="/blog"
                className="hidden md:inline-flex items-center text-primary font-semibold hover:underline"
              >
                Ver todos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {loadingPosts ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-6">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <article
                    key={post.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {post.cover_image_url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.blog_categories && (
                        <span className="text-xs font-medium text-primary mb-2 inline-block">
                          {post.blog_categories.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-3 text-primary group-hover:underline">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-medium text-primary group-hover:underline flex items-center"
                      >
                        Ler artigo
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="text-center mt-8 md:hidden">
              <Link
                to="/blog"
                className="inline-flex items-center text-primary font-semibold hover:underline"
              >
                Ver todos os artigos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Index;