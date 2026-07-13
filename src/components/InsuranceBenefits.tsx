import { MessageCircle } from "lucide-react";

import { Button, Card, Container, Heading, Section } from "@/components/public";

const WHATSAPP_BASE_URL = "https://wa.me/5511910163007";

const healthInsuranceLogos = [
  { src: "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/planos/Logo-Climed.png", alt: "Climéd" },
];

const santherLogoUrl =
  "https://bnqiezpltfgixkafizzm.supabase.co/storage/v1/object/public/site-images/planos/Santher-Logo-Vector.svg-.png";

const santherWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre o benefício destinado aos colaboradores da Santher e seus familiares.",
)}`;

const reimbursementWhatsAppUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
  "Olá, gostaria de saber mais sobre a possibilidade de reembolso dos atendimentos realizados na Clínica Crescer.",
)}`;

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
            <div className="mt-6 flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-white/60 p-4">
              {hasMultipleInsurances ? (
                <div className="flex w-max animate-[promoMarquee_40000ms_linear_infinite] items-center gap-8 motion-reduce:animate-none">
                  {[...healthInsuranceLogos, ...healthInsuranceLogos].map((logo, index) => (
                    <img
                      key={index}
                      src={logo.src}
                      alt={logo.alt}
                      className="h-12 w-auto max-w-[120px] shrink-0 object-contain"
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
                    className="h-14 w-auto max-w-[140px] object-contain"
                    loading="lazy"
                  />
                ))
              )}
            </div>
          </Card>

          {/* Card 2: Empresas */}
          <Card tone="warm" interactive className="flex flex-col">
            <h3 className="text-xl font-semibold text-[#262033]">Benefícios para empresas</h3>
            <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl bg-white/60 p-4">
              <img
                src={santherLogoUrl}
                alt="Santher"
                className="h-14 w-auto max-w-[140px] object-contain"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5d546b]">
              Colaboradores da Santher contam com condições especiais para atendimentos destinados a seus familiares.
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-6">
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
            <Button asChild variant="ghost" size="sm" className="mt-6">
              <a
                href={reimbursementWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar com a equipe sobre reembolso"
              >
                Falar com a equipe
              </a>
            </Button>
          </Card>
        </div>
      </Container>
    </Section>
  );
};