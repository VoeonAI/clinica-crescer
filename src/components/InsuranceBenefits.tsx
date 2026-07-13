import { MessageCircle } from "lucide-react";

import { Button, Card, Container, Heading, Section } from "@/components/public";

const WHATSAPP_BASE_URL = "https://wa.me/5511910163007";

const healthInsuranceLogos = [
  { src: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/planos/Logo-Climed.png", alt: "Climéd", maxWidth: "85%", maxHeight: "90%" },
];

const santherLogo = {
  src: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/planos/Santher-Logo-Vector.svg-.png",
  alt: "Santher",
  maxWidth: "60%",
  maxHeight: "70%",
};

const santherWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre o benefício destinado aos colaboradores da Santher e seus familiares.",
)}`;

const reimbursementWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre a possibilidade de reembolso dos atendimentos realizados na Clínica Crescer.",
)}`;

const insurancesWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre os convênios atendidos pela Clínica Crescer.",
)}`;

const LogoContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 flex h-32 w-full items-center justify-center rounded-2xl bg-white/60 p-4">
    {children}
  </div>
);

export const InsuranceBenefits = () => {
  const hasMultipleInsurances = healthInsuranceLogos.length > 1;

  return (
    <Section tone="default">
      <Container>
        <Heading
          eyebrow="Acesso e Benefícios"
          title="Mais possibilidades para cuidar de quem importa"
          description="Conheça as formas de acesso aos atendimentos da Clínica Crescer e converse com nossa equipe para entender qual opção se aplica à sua família."
          align="center"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Convênios */}
          <Card tone="blue" interactive className="flex flex-col">
            <h3 className="text-xl font-semibold text-[#262033]">Convênios atendidos</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d546b]">
              Atendemos famílias por meio de convênios parceiros. Consulte nossa equipe para confirmar cobertura, elegibilidade e modalidades de atendimento.
            </p>
            <LogoContainer>
              {hasMultipleInsurances ? (
                <div className="flex w-max animate-[promoMarquee_40000ms_linear_infinite] items-center gap-8 motion-reduce:animate-none">
                  {[...healthInsuranceLogos, ...healthInsuranceLogos].map((logo, index) => (
                    <img
                      key={index}
                      src={logo.src}
                      alt={logo.alt}
                      style={{ maxWidth: logo.maxWidth, maxHeight: logo.maxHeight }}
                      className="h-auto w-auto shrink-0 object-contain"
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : (
                healthInsuranceLogos.map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    style={{ maxWidth: logo.maxWidth, maxHeight: logo.maxHeight }}
                    className="h-auto w-auto object-contain"
                    loading="lazy"
                  />
                ))
              )}
            </LogoContainer>
            <div className="mt-auto pt-6">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <a
                  href={insurancesWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Saiba mais sobre os convênios atendidos"
                >
                  <MessageCircle className="h-4 w-4" />
                  Saiba mais
                </a>
              </Button>
            </div>
          </Card>

          {/* Card 2: Empresas */}
          <Card tone="warm" interactive className="flex flex-col">
            <h3 className="text-xl font-semibold text-[#262033]">Benefícios para empresas</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d546b]">
              Colaboradores da Santher contam com condições especiais para atendimentos destinados a seus familiares.
            </p>
            <LogoContainer>
              <img
                src={santherLogo.src}
                alt={santherLogo.alt}
                style={{ maxWidth: santherLogo.maxWidth, maxHeight: santherLogo.maxHeight }}
                className="h-auto w-auto object-contain"
                loading="lazy"
              />
            </LogoContainer>
            <div className="mt-auto pt-6">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <a
                  href={santherWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Consultar benefício para colaboradores da Santher"
                >
                  <MessageCircle className="h-4 w-4" />
                  Consultar benefício
                </a>
              </Button>
            </div>
          </Card>

          {/* Card 3: Reembolso */}
          <Card tone="lilac" interactive className="flex flex-col">
            <h3 className="text-xl font-semibold text-[#262033]">Reembolso pelo plano de saúde</h3>
            <p className="mt-4 text-sm leading-7 text-[#5d546b]">
              Dependendo da cobertura do seu plano de saúde, pode ser possível solicitar o reembolso dos atendimentos realizados na Clínica Crescer. Emitimos nota fiscal e fornecemos a documentação necessária para que a família faça a solicitação junto ao convênio.
            </p>
            <div className="mt-4 rounded-xl bg-[#5b3d86]/10 p-3 text-sm font-semibold text-[#5b3d86]">
              Consulte nossa equipe para entender como funciona.
            </div>
            <div className="mt-auto pt-6">
              <Button asChild variant="ghost" size="sm" className="w-full">
                <a
                  href={reimbursementWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Falar com a equipe sobre reembolso"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar com a equipe
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};